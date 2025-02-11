import GitHubSignIn from '@/components/buttons/GitHubSignIn';
import GoogleSignIn from '@/components/buttons/GoogleSignIn';
import { generateAccessTokenGoogle, isLoggedInToGitHub, isLoggedInToGoogle } from '@/util/auth';
import { createClient } from '@/util/supabase/server';
import moment from 'moment';

type Commit = {
    commit: {
        message: string,
        author: {
            date: string
        }
    }
}



export default async function DashboardPage() {

    
    async function getReportGitHubGoogleAnalytics(formData: FormData) {
        "use server";
        const supabase = await createClient();

        const user = await supabase.auth.getUser();
        
        const data = {
            repo: formData.get('repo'),
            gitToken: user.data.user?.user_metadata.githubAccessToken,
            gaToken: user.data.user?.user_metadata.googleAccessToken,
            dateFrom: formData.get('date_from') as string,
            dateTo: formData.get('date_to') as string
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

        console.log(gaData);
        console.log(githubData);

        //console.log(githubData);
        // console.log(gaData);
    }

    const currDate = moment();

    const currDateStr = currDate.format('yyyy-MM-DD');
    const prevMonthDateStr = moment(currDate).subtract(1, 'month').format('yyyy-MM-DD');

    console.log(currDateStr);

    const showReportForm = await isLoggedInToGitHub() && await isLoggedInToGoogle();

    return (
        <div className='flex flex-col gap-4 p-4'>
            <h1>Dashboard</h1>
            <div className='flex flex-col gap-2'>
                <GoogleSignIn />
                <GitHubSignIn />
            </div>
            <div className='border border-neutral-600 p-4 bg-neutral-900 rounded-sm flex flex-col gap-4'>
                <h2>Generate Report</h2>
                {!showReportForm ? 
                    <span className='text-sm text-neutral-400'>Please sign in to GitHub and Google to generate report</span>
                : 
                    <form action={getReportGitHubGoogleAnalytics} className='flex flex-col gap-2 max-w-[400px]'>
                        <div className='flex gap-2'>
                            <input type='date' name='date_from' defaultValue={prevMonthDateStr}></input>
                            -
                            <input type='date' name='date_to' defaultValue={currDateStr}></input>
                        </div>
                        <input name='repo' placeholder='GitHub repo name' />
                        <button>Generate Report</button>
                    </form> 
                }
            </div>
        </div>
    )
}