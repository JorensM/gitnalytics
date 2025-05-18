import { generateAccessTokenGoogle } from '@/util/auth';
import { createClient } from '@/util/supabase/server';
import moment from 'moment';
import { NextRequest, NextResponse } from 'next/server';

export type Commit = {
    message: string,
    pushDate?: string
}

const convertCommitHistoryToGARowData = (commitHistory: Commit[], startDate: string, endDate: string) => {
    const startDateM = moment(startDate);
    const endDateM = moment(endDate);

    const numDays = Math.abs(endDateM.diff(startDateM, 'days'));

    const rows = [];

    for(let day = 0; day < numDays; day++) {
        const date = moment(startDateM).add(day, 'days');
        const commits = commitHistory.filter(commit => moment(commit.pushDate).isSame(date, 'date'));
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

type GHEvent = {
    type: 'PushEvent' | string
}

type GHPushEvent = {
    type: 'PushEvent',
    payload: {
        commits: {
            message: string
        }[]
    },
    created_at: string
}

const pushEventsToCommits = (pushEvents: GHPushEvent[]) => {
    return pushEvents.flatMap(event => event.payload.commits.map(commit => ({
        ...commit,
        pushDate: event.created_at
    })))
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
        dateTo: req.nextUrl.searchParams.get('dateTo') as string,
        metric: req.nextUrl.searchParams.get('metric') as string
    }

    const property = req.nextUrl.searchParams.get('property');

    // console.log('gaToken: ', data.gaToken);

    // /commits?since=' + moment(data.dateFrom).toISOString() + '&until=' + moment(data.dateTo).toISOString()

    const res = await fetch('https://api.github.com/repos/' + data.repo + '/events', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + data.gitToken
        }
    });

    if(res.status !== 200) {
        throw new Error (await res.text())
    }
    const githubData: GHPushEvent[] = await res.json();

    const pushEvents: GHPushEvent[] = githubData.filter(event => event.type === 'PushEvent');

    const commits = pushEventsToCommits(pushEvents);

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
            "metrics": [{ "name": data.metric }],
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

    // todo: test to ensure that the pushDate of commits is not the same as the creation date of the commits
    const commitHistoryRows = convertCommitHistoryToGARowData(commits, data.dateFrom, data.dateTo);

    const rows = generateReport(gaData.rows, commitHistoryRows, data.dateFrom, data.dateTo);

    return NextResponse.json(rows);
}