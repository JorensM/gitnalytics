"use client"
import { CategoryScale, Chart, Legend, LinearScale, LineController, LineElement, PointElement, Tooltip } from 'chart.js';
import moment from 'moment';
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Commit } from '@/app/api/reports/github-ga/route';
import Spinner from './Spinner';
import GaPropertySelect from './selects/GaPropertySelect';
import { createClient } from '@/util/supabase/client';
import GitHubRepositorySelect, { GitHubRepository } from './selects/GitHubRepositorySelect';
import GaMetricSelect from './selects/GaMetricSelect';
import { GA_METRICS } from '@/constants/googleAnalytics';

Chart.register(LineController, CategoryScale, LinearScale, PointElement, 
    LineElement, 
    Tooltip, 
    ChartDataLabels,
    Legend
);

export type GaProperties = {
    name: string,
    account: string,
    displayName: string
}[];

type ReportFormProps = {
    properties: GaProperties,
    repositories: GitHubRepository[]
}

const getGAMetricLabel = (metric: string): string => GA_METRICS.find(_metric => _metric.value === metric)!.label;

export default function ReportForm( { properties, repositories }: ReportFormProps ) {

    const [data, setData] = useState<any[] | null>(null);
    const [fetchingData, setFetchingData] = useState<boolean>(false);
    const chartElementRef = useRef<HTMLCanvasElement>(null);
    const [selectedProperty, setSelectedProperty] = useState<string>(properties[0].name);
    const [selectedMetric, setSelectedMetric] = useState<string>('activeUsers');
    const chartRef = useRef<Chart>(null);

    const getDataPoint = useCallback((index: number) => {
        console.log('getting data point from data: ', data);
        data?.[index]
    }, [data]);

    useEffect(() => {
        if(!chartElementRef) return;
        if(chartRef.current) chartRef.current.destroy();
        chartRef.current = new Chart(chartElementRef.current!, {
            type: 'line',
            options: {
                scales: {
                    x: {
                        grid: {
                            color: '#3d3d3d'
                        }
                    },
                    y: {
                        grid: {
                            color: '#3d3d3d'
                        }
                    }
                },
                elements: {
                    line: {
                        tension: 0.4
                    }
                },
                interaction: {
                    intersect: true,
                    mode: 'index'
                },
                layout: {
                    padding: 50
                },
                plugins: {
                    legend: {
                        display: true
                    },
                }
            },
            data: {
                labels: [],
                datasets: []
            }
        })
    }, [chartElementRef])

    useEffect(() => {
        setFetchingData(false);
        if(!data) return;
        // console.log('updating')
        chartRef.current!.config.data = {
            labels: data.map((row, index) => moment(row.date).format('D MMM')),
            datasets: [
                {
                    label: getGAMetricLabel(selectedMetric),
                    data: data.map(row => row.ga.metricValues[0]?.value),
                    borderColor: 'blue',
                    pointBackgroundColor: 'darkblue'
                },
                {
                    label: 'Commits',
                    data: data.map(row => row.gh?.length || 0),
                    borderColor: 'orange',
                    pointBackgroundColor: 'darkorange'
                }
            ],
        }
        chartRef.current!.options.plugins!.tooltip!.callbacks = {
            afterBody: (items) => {
                const context = items[1];
                if((context.raw as number) > 0) {
                    // console.log('index: ', context.dataIndex);
                    const dataPoint: Commit[] = data[context.dataIndex]?.gh as unknown as Commit[];
                    // console.log('datapoint: ', dataPoint);
                    if(!dataPoint) {
                        return;
                    }
                    return (
                        dataPoint.map((commit: Commit) => commit.message).join('\n')
                    );
                }
            }
        }

        chartRef.current?.update();
    }, [data]);

    const getReportGitHubGoogleAnalytics = useCallback(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFetchingData(true);
        const formData = new FormData(e.currentTarget);

        const data = {
            repo: formData.get('repo'),
            dateFrom: formData.get('date_from') as string,
            dateTo: formData.get('date_to') as string
        }

        // console.log('selected property: ', selectedProperty);

        const res = await fetch(`/api/reports/github-ga?repo=${data.repo}&dateFrom=${data.dateFrom}&dateTo=${data.dateTo}&property=${selectedProperty}&metric=${selectedMetric}`);

        if(res.status !== 200) {
            throw new Error(await res.text());
        }

        const report = await res.json();

        setData(report);
        // console.log(report);
        //console.log(githubData);
        // console.log(gaData);
    }, [selectedProperty, selectedMetric]);

    const currDate = moment();

    const currDateStr = currDate.format('yyyy-MM-DD');
    const prevMonthDateStr = moment(currDate).subtract(1, 'month').format('yyyy-MM-DD');

    const handlePropertyChange = (property: string) => {
        console.log('property change: ', property);
        setSelectedProperty(property);
    }

    const handleMetricChange = (metric: string) => {
        setSelectedMetric(metric);
    }
    
    // console.log(currDateStr);

    return (
        <div className='flex flex-col gap-2 w-full'>
            <form onSubmit={getReportGitHubGoogleAnalytics} className='flex flex-col gap-2 max-w-[400px]'>
                <div className='flex gap-2'>
                    <input type='date' name='date_from' defaultValue={prevMonthDateStr}></input>
                    -
                    <input type='date' name='date_to' defaultValue={currDateStr}></input>
                </div>
                <GaPropertySelect 
                    properties={properties}
                    onChange={handlePropertyChange}
                    defaultValue={properties[0].name}
                />
                <GitHubRepositorySelect
                    repositories={repositories}
                    name='repo'
                />
                <GaMetricSelect
                    onChange={handleMetricChange}
                    defaultValue={selectedMetric}
                />
                <button className='w-fit'>Generate Report</button>
            </form> 
            {fetchingData ? <Spinner/> : null}
            <div
                className={!data ? 'hidden' : ''}
            >
                <canvas
                    ref={chartElementRef}
                >
                    
                </canvas>

            </div>
        </div>
    )
}