import GitHubSignIn from '@/components/buttons/GitHubSignIn';
import GoogleSignIn from '@/components/buttons/GoogleSignIn';
import ReportForm, { GaProperties } from '@/components/ReportForm';
import { generateAccessTokenGoogle, isLoggedInToGitHub, isLoggedInToGoogle } from '@/util/auth';
import { createClient } from '@/util/supabase/server';
import moment from 'moment';





export default async function DashboardPage() {

    const showReportForm = await isLoggedInToGitHub() && await isLoggedInToGoogle();

    const fetchProperties = async () => {
        console.log('fetching properties');
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();

        const token = user?.user_metadata.googleAccessToken;

        const accountsRes = await fetch('https://analyticsadmin.googleapis.com/v1beta/accounts', {   
            headers: {
                'Content-Type': "application/json",
                'Authorization': 'Bearer ' + token
            }
        })

        const accounts = (await accountsRes.json()).accounts;

        // console.log('accounts: ', accounts);

        let properties: any[] = [];

        for(const account of accounts) {
            const res = await fetch('https://analyticsadmin.googleapis.com/v1beta/properties?filter=parent:' + account.name, {
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': 'Bearer ' + token
                }
            })

            const data = await res.json();

            properties = properties.concat(data.properties);
        }


        console.log('properties: ', properties);
        return properties;
    }


    let properties: GaProperties = [];

    const googleSignedIn = await isLoggedInToGoogle();
    
    if(googleSignedIn) {
        await generateAccessTokenGoogle();
        properties = await fetchProperties();
    }



    return (
        <div className='flex h-full'>
            <div className='flex gap-4 flex-col p-4 border-r border-neutral-800 h-full max-w-[290px]'>
                <h1>Dashboard</h1>
                <div className='flex flex-col gap-2'>
                    <GoogleSignIn />
                    <GitHubSignIn />
                </div>
            </div>
            <div className='flex flex-col gap-4 p-4 flex-grow'>
                <div className='border border-neutral-600 p-4 bg-neutral-900 rounded-sm flex flex-col gap-4'>
                    <h2>Generate Report</h2>
                    {!showReportForm ? 
                        <span className='text-sm text-neutral-400'>Please sign in to GitHub and Google to generate report</span>
                    : 
                        <ReportForm 
                            properties={properties}
                        />
                    }
                </div>
            </div>
        </div>
        
    )
}