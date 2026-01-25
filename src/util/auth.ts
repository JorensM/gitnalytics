// import { createClient } from './supabase/server';
// import { SupabaseClient } from '@supabase/supabase-js';

import database from "@/classes/serverDB";

/**
 * Create a supabase client if arg is not already a supabase client. Otherwise
 * just return the arg
 * @param supabaseClient 
 */
// export async function createClientIfNull(supabaseClient?: SupabaseClient) {
//     return supabaseClient || await createClient();
// }

// export async function getSupabaseUser(supabaseClient: SupabaseClient) {

//     //const { data: { user }, error } = await supabase.auth.getUser();
// }

export async function isLoggedInToGitHub() {
    const user = await database.getUser();

    return !!user?.user_metadata.githubAccessToken;
}

export async function isLoggedInToGoogle() {
    const user = await database.getUser();

    return !!user?.user_metadata.googleRefreshToken;
}

export async function generateAccessTokenGoogle() {
    const user = await database.getUser();

    if(!user) {
        throw new Error('Could not find current user');
    }

    const refreshToken = user.user_metadata.googleRefreshToken;

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

    try {
        await database.updateUser({
            data: {
                googleAccessToken: data.access_token
            }
        });
    } catch (error) {
        throw error;
    }

    return data.access_token;
}