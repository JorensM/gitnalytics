import { isLoggedInToGitHub } from '@/util/auth';
import { createClient } from '@/util/supabase/server'

export default async function GitHubSignIn() {

    const isLoggedIn = await isLoggedInToGitHub();

    return (
        isLoggedIn ? 
        <span>✔️ Signed in to GitHub</span> :
        <a 
            href={"https://github.com/login/oauth/authorize?scope=user:email&client_id=" + process.env.GITHUB_CLIENT_ID}
            className='button'
        >
            Sign in to GitHub
        </a>
    )
}