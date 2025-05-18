import { redirect } from 'next/navigation';
import { createClient } from './supabase/server';
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Create a supabase client if arg is not already a supabase client. Otherwise
 * just return the arg
 * @param supabaseClient 
 */
export async function createClientIfNull(supabaseClient?: SupabaseClient) {
    return supabaseClient || await createClient();
}

/**
 * Retrieves a user's ID by their email address using a database function.
 * @param {string} email - The email address to look up.
 * @returns {Promise<string | null>} A Promise that resolves to the user's ID, or null if not found.
 */
export async function getUserIDByEmail(email: string, supabaseClient?: SupabaseClient): Promise<string | null> {
    const supabase = await createClientIfNull(supabaseClient);
    const { data, error } = await supabase.rpc('get_user_id_by_email', { p_email: email });

    if (error) {
        console.error('getUserIDByEmail error', error);
        return null;
    }

    return data || null;
}

export async function getDBUserByEmail(email: string, supabaseClient?: SupabaseClient) {

    const supabase = await createClientIfNull(supabaseClient);

    const userID = await getUserIDByEmail(email, supabase);

    if(!userID) {
        return null;
    }

    const { data: { user }, error } = await supabase.auth.admin.getUserById(userID);

    if(error) {
        throw error;
    }

    return user;

    //const { data: { user }, error } = await supabase.auth.getUser();
}

export async function logout(supabaseClient?: SupabaseClient) {
    const supabase = await createClientIfNull(supabaseClient);

    const res = await supabase.auth.signOut();

    if(res.error) {
        throw res.error;
    }

    redirect('/');
}

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