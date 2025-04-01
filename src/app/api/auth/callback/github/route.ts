import GitHubClient from '@/util/clients/git/GitHubClient';
import { createClient } from '@/util/supabase/server';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {

    const supabaseClient = await createClient();
    const code = req.nextUrl.searchParams.get('code');

    if(!code) {
        throw new Error("missing 'code' param");
    }

    const github = new GitHubClient();

    const { accessToken: githubAccessToken } = await github.authCallback(code);

    const supabaseRes = await supabaseClient.auth.updateUser({
        data: {
            githubAccessToken
        }
    })

    if(supabaseRes.error) {
        throw supabaseRes.error
    }

    redirect('/dashboard');
}