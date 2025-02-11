import { createClient } from './supabase/server';

export async function isLoggedInToGitHub() {
    const supabase = await createClient();

    const user = await supabase.auth.getUser();

    return !!user.data.user?.user_metadata.githubAccessToken;
}

export async function isLoggedInToGoogle() {
    const supabase = await createClient();

    const user = await supabase.auth.getUser();

    return !!user.data.user?.user_metadata.googleRefreshToken;
}

export async function generateAccessTokenGoogle() {
    const supabase = await createClient();

    const user = await supabase.auth.getUser();

    const refreshToken = user.data.user?.user_metadata.googleRefreshToken;

    const res = await fetch('https://www.googleapis.com/oauth2/v4/token', {
        method: 'POST',
        body: JSON.stringify({
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            refresh_token: refreshToken,
            grant_type: 'refresh_token'
        })  
    })

    if(res.status !== 200) {
        throw new Error(await res.text());
    }

    const data = await res.json();

    const resSupabase = await supabase.auth.updateUser({
        data: {
            googleAccessToken: data.access_token
        }
    });

    if(resSupabase.error) {
        throw resSupabase.error
    }

    return data.access_token;
}