import GitHubClient from '@/util/clients/git/GitHubClient';
import { createClient } from '@/util/supabase/server';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';
import database from '@/classes/serverDB';

export async function GET(req: NextRequest) {

    const code = req.nextUrl.searchParams.get('code');

    if(!code) {
        throw new Error("missing 'code' param");
    }

    const github = new GitHubClient();

    const { accessToken: githubAccessToken } = await github.authCallback(code);

    try {
        await database.updateUser({
            data: {
                githubAccessToken
            }
        })
    } catch (e) {
        throw e;
    }

    redirect('/dashboard');
}