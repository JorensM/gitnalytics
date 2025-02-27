import { generateAccessTokenGoogle } from '@/util/auth';
import { createClient } from '@/util/supabase/server';
import moment from 'moment';
import { NextRequest, NextResponse } from 'next/server';

export type Commit = {
    commit: {
        message: string,
        author: {
            date: string
        }
    }
}

const convertCommitHistoryToGARowData = (commitHistory: Commit[], startDate: string, endDate: string) => {
    const startDateM = moment(startDate);
    const endDateM = moment(endDate);

    const numDays = Math.abs(endDateM.diff(startDateM, 'days'));

    const rows = [];

    for(let day = 0; day < numDays; day++) {
        const date = moment(startDateM).add(day, 'days');
        const commits = commitHistory.filter(commit => moment(commit.commit.author.date).isSame(date, 'date'));
        rows.push(commits);
    }

    return rows;
}

const generateReport = (gaRows: any[], ghRows: Commit[][], startDate: string, endDate: string) => {
    const startDateM = moment(startDate);
    const endDateM = moment(endDate);
    const days = Math.abs(endDateM.diff(startDateM, 'days'));

    const report = [...Array(days + 1)].map((d, day) => ({
        ga: gaRows.find(row => moment(row.dimensionValues[0].value).isSame(moment(startDateM).add(day, 'days'), 'date')) || { metricValues: [ { value: 0 } ]},
        gh: ghRows[day],
        date: moment(startDateM).add(day, 'days').format('YYYY-MM-DD')
    }))
    return report;
}

export async function GET(req: NextRequest) {
    const supabase = await createClient();
    
    await generateAccessTokenGoogle();

    const user = await supabase.auth.getUser();
    
    const data = {
        repo: req.nextUrl.searchParams.get('repo'),
        gitToken: user.data.user?.user_metadata.githubAccessToken,
        gaToken: user.data.user?.user_metadata.googleAccessToken,
        dateFrom: req.nextUrl.searchParams.get('dateFrom') as string,
        dateTo: req.nextUrl.searchParams.get('dateTo') as string
    }

    const property = req.nextUrl.searchParams.get('property');

    // console.log('gaToken: ', data.gaToken);

    const res = await fetch('https://api.github.com/repos/' + data.repo + '/commits?since=' + moment(data.dateFrom).toISOString() + '&until=' + moment(data.dateTo).toISOString(), {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + data.gitToken
        }
    })

    if(res.status !== 200) {
        throw new Error (await res.text())
    }
    const githubData = await res.json();

    const gaRes = await fetch('https://analyticsdata.googleapis.com/v1beta/' + property + ':runReport', {
        method: "POST",
        headers: {
            'Content-Type': "application/json",
            'Authorization': 'Bearer ' + data.gaToken
        },
        body: JSON.stringify({
            "dateRanges": [{ 
                "startDate": data.dateFrom, 
                "endDate": data.dateTo
            }],
            "dimensions": [{ "name": "date" }],
            "metrics": [{ "name": "activeUsers" }],
            "orderBys": [
                {
                    "dimension": {
                        "dimensionName": "date"
                    }
                }
            ],
            "keepEmptyRows": true
        })
    })

    if(gaRes.status !== 200) {
        console.log(await gaRes.text());
        throw new Error(gaRes.status.toString());
    }

    const gaData = await gaRes.json();

    // console.log(gaData);

    const commitHistoryRows = convertCommitHistoryToGARowData(githubData, data.dateFrom, data.dateTo);

    const rows = generateReport(gaData.rows, commitHistoryRows, data.dateFrom, data.dateTo);

    return NextResponse.json(rows);
}