export default function GitHubSignIn() {
    return (
        <a 
            href={"https://github.com/login/oauth/authorize?scope=user:email&client_id=" + process.env.GITHUB_CLIENT_ID}
            className='button'
        >
            Sign in to GitHub
        </a>
    )
}