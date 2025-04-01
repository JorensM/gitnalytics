import { createClient } from '@/util/supabase/server';
import GitClient from './GitClient';
import { GitClientAuthResponse } from './types';
import { redirect } from 'next/navigation';

export default class GitHubClient extends GitClient {
    authRedirectURL(): string {
        return "https://github.com/login/oauth/authorize?scope=user:email%20read:org&client_id=" + process.env.GITHUB_CLIENT_ID;
    }

    async authCallback(code: string): Promise<GitClientAuthResponse> {
        const res = await fetch(`https://github.com/login/oauth/access_token?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${code}&accept=json`, {
            method: 'POST'
        });

        if(res.status !== 200) {
            // console.log(res);
            throw new Error(await res.text());
        }

        const data = new URLSearchParams(await res.text());

        const accessToken = data.get('access_token');

        if(!accessToken) {
            throw new Error('Could not find access_token');
        }

        return {
            accessToken
        };
    }

    async revokeAccess(): Promise<void> {
        const supabase = await createClient();
        // Clear access token from user metadata
        await supabase.auth.updateUser({
            data: {
                githubAccessToken: null
            }
        })
        redirect('https://github.com/settings/connections/applications/' + process.env.GITHUB_CLIENT_ID);
    }
}