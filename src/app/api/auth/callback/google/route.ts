import { NextRequest, NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import { redirect } from 'next/navigation';
import { createClient } from '@/util/supabase/server';
import { GetTokenResponse } from 'google-auth-library/build/src/auth/oauth2client';


export async function GET(req: NextRequest) {
    const supabaseClient = await createClient();
    const redirectUri = process.env.APP_URL + '/api/auth/callback/google';

    const client = new OAuth2Client({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        redirectUri
    });
    const code = new URL(req.url).searchParams.get('code') as string;

    // console.log(code);
    // Now that we have the code, use that to acquire tokens.
    const r = await client.getToken(code);
    // Make sure to set the credentials on the OAuth2 client.
    client.setCredentials(r.tokens);

    // console.log(r.tokens);

    const res = await supabaseClient.auth.updateUser({
        data: {
            googleRefreshToken: r.tokens.refresh_token,
            googleAccessToken: r.tokens.access_token
        }
    })

    if(res.error) {
        throw res.error;
    }

    redirect('/dashboard');
}