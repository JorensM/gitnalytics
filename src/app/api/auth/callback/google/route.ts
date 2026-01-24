import { NextRequest, NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import { redirect } from 'next/navigation';
import { APP_URL } from '@/constants/envVars';
import database from '@/classes/serverDB';


export async function GET(req: NextRequest) {
    const redirectUri = APP_URL + '/api/auth/callback/google';

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

    try {
        await database.updateUser({
            data: {
                googleRefreshToken: r.tokens.refresh_token || undefined,
                googleAccessToken: r.tokens.access_token || undefined
            }
        })
    } catch (error) {
        throw error;
    }

    redirect('/dashboard');
}