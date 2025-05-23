import { isLoggedInToGitHub } from '@/util/auth';
import GitHubClient from '@/util/clients/git/GitHubClient';

export default async function GitHubSignIn() {

    const isLoggedIn = await isLoggedInToGitHub();
    
    const handleLogout = async () => {
        "use server";
        const github = new GitHubClient();
        await github.revokeAccess();
    }

    const github = new GitHubClient();
    const authURL = github.authRedirectURL();

    return (
        isLoggedIn ? 
        <div className='flex flex-col'>
            <span>✔️ Signed in to GitHub</span>
            <button className='border-none h-fit w-fit text-sm text-neutral-500' onClick={handleLogout}>Sign out</button>
        </div>  :
        <a 
            href={authURL}
            className='button w-full'
        >
            Sign in to GitHub
        </a>
    )
}