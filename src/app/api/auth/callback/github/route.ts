import { createClient } from '@/util/supabase/server';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {

    const supabaseClient = await createClient();

    const code = req.nextUrl.searchParams.get('code');

    const res = await fetch(`https://github.com/login/oauth/access_token?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${code}&accept=json`, {
        method: 'POST'
    });

    if(res.status !== 200) {
        // console.log(res);
        throw new Error(await res.text());
    }

    const data = new URLSearchParams(await res.text());

    // console.log(data);

    const supabaseRes = await supabaseClient.auth.updateUser({
        data: {
            githubAccessToken: data.get('access_token')
        }
    })

    if(supabaseRes.error) {
        throw supabaseRes.error
    }

    redirect('/dashboard');
}