import GitHubSignIn from '@/components/buttons/GitHubSignIn';
import GoogleSignIn from '@/components/buttons/GoogleSignIn';
import { createClient } from '@/util/supabase/server';
import moment from 'moment';

export default async function DashboardPage() {

    
    async function getReportGitHubGoogleAnalytics(formData: FormData) {
        "use server";
        const supabase = await createClient();

        const res = await fetch('https://api.github.com/repos/' + data.repo + '/commits', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + data.gitToken
            }
        })

        if(res.status !== 200) {
            throw new Error (await res.text())
        }
        const githubData = await res.text();

        const user = await supabase.auth.getUser();

        const gaRes = await fetch('https://analyticsdata.googleapis.com/v1beta/properties/323656472:runReport?access_token=' + data.gaToken, {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
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
            throw new Error(gaRes.status.toString());
        }

        const gaData = await gaRes.text();

        //console.log(githubData);
        // console.log(gaData);
    }

    const currDate = moment();

    const currDateStr = currDate.format('yyyy-MM-DD');
    const prevMonthDateStr = moment(currDate).subtract(1, 'month').format('yyyy-MM-DD');

    console.log(currDateStr);

    return (
        <div className='flex flex-col gap-4 p-4'>
            <h1>Dashboard</h1>
            <GoogleSignIn />
            <GitHubSignIn />
            <h2>Generate Report</h2>
            <form action={getReportGitHubGoogleAnalytics} className='flex flex-col gap-2 max-w-[400px]'>
                <div className='flex gap-2'>
                    <input type='date' name='date_from' defaultValue={prevMonthDateStr}></input>
                    -
                    <input type='date' name='date_to' defaultValue={currDateStr}></input>
                </div>
                <input placeholder='GitHub Personal Access Token' name='git_token'/>
                <input placeholder='Google Analytics Secret' name='ga_token' />
                <button>Generate Report</button>
            </form>
        </div>
    )
}