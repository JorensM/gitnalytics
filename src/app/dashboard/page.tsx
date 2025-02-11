import GitHubSignIn from '@/components/buttons/GitHubSignIn';
import GoogleSignIn from '@/components/buttons/GoogleSignIn';
import ReportForm from '@/components/ReportForm';
import { generateAccessTokenGoogle, isLoggedInToGitHub, isLoggedInToGoogle } from '@/util/auth';
import { createClient } from '@/util/supabase/server';
import moment from 'moment';





export default async function DashboardPage() {

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
                    <ReportForm />
                }
            </div>
        </div>
    )
}