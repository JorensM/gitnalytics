import { isLoggedInToGitHub } from '@/util/auth';
import { createClient } from '@/util/supabase/server'
import { redirect } from 'next/navigation';

export default async function GitHubSignIn() {

    const isLoggedIn = await isLoggedInToGitHub();

    const handleLogout = async () => {
        "use server";
        const supabase = await createClient()
        await supabase.auth.updateUser({
            data: {
                githubAccessToken: null
            }
        })

        redirect('https://github.com/settings/connections/applications/' + process.env.GITHUB_CLIENT_ID);
    }

    return (
        isLoggedIn ? 
        <div className='flex flex-col'>
            <span>✔️ Signed in to GitHub</span>
            <button className='border-none h-fit w-fit text-sm text-neutral-500' onClick={handleLogout}>Sign out</button>
        </div>  :
        <a 
            href={"https://github.com/login/oauth/authorize?scope=user:email&client_id=" + process.env.GITHUB_CLIENT_ID}
            className='button w-full'
        >
            Sign in to GitHub
        </a>
    )
}