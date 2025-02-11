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

const generateReport = (gaRows: any[], ghRows: Commit[][]) => {
    return gaRows.map((gaRow, index) => ({ga: gaRow, gh: ghRows[index]}));
}

export async function GET(req: NextRequest) {
    const supabase = await createClient();
    
    const user = await supabase.auth.getUser();
    
    const data = {
        repo: req.nextUrl.searchParams.get('repo'),
        gitToken: user.data.user?.user_metadata.githubAccessToken,
        gaToken: user.data.user?.user_metadata.googleAccessToken,
        dateFrom: req.nextUrl.searchParams.get('date_from') as string,
        dateTo: req.nextUrl.searchParams.get('date_to') as string
    }

    console.log('gaToken: ', data.gaToken);

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

    await generateAccessTokenGoogle();

    const gaRes = await fetch('https://analyticsdata.googleapis.com/v1beta/properties/323656472:runReport', {
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
            "dimensions": [{ "name": "country" }],
            "metrics": [{ "name": "activeUsers" }]   
        })
    })

    if(gaRes.status !== 200) {
        console.log(await gaRes.text());
        throw new Error(gaRes.status.toString());
    }

    const gaData = await gaRes.json();

    const commitHistoryRows = convertCommitHistoryToGARowData(githubData, data.dateFrom, data.dateTo);

    const rows = generateReport(gaData.rows, commitHistoryRows);

    return NextResponse.json(rows);
}