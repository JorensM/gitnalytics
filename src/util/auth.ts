import { redirect } from 'next/navigation';
import { createClient } from './supabase/server';
import { SupabaseClient, User } from '@supabase/supabase-js';
import { deleteCustomerByCustomerID } from './stripe';
import moment from 'moment';

const searchParamsStr = (params?: Record<string, string>) => params ? Object.entries(params)
  .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
  .join('&') : '';

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

export async function logout(params?: { error?: string, message?: string }, supabaseClient?: SupabaseClient) {
    const supabase = await createClientIfNull(supabaseClient);

    const res = await supabase.auth.signOut();

    if(res.error) {
        throw res.error;
    }

    const encodedParams: Record<string, string> = {};

    if(params) {
        for(const [key, value] of Object.entries(params)) {
            encodedParams[key] = encodeURIComponent(value);
        }
    }


    redirect('/login?' + searchParamsStr(params));
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

const isTokenExpired = (tokenExpirationDate?: string) => {
    return tokenExpirationDate ? moment(tokenExpirationDate).isBefore(moment()) : false;
}

export async function generateAccessTokenGoogle() {
    console.log('generating google access token');
    const supabase = await createClient();

    const user = await supabase.auth.getUser();

    const refreshToken = user.data.user?.user_metadata.googleRefreshToken;
    const expirationDate = user.data.user?.user_metadata.googleAccessTokenExpiresAt;

    if(!isTokenExpired(expirationDate)) {
        console.log('token not expired, reusing');
        return user.data.user?.user_metadata.googleAccessToken;
    }

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

    console.log(data);

    const resSupabase = await supabase.auth.updateUser({
        data: {
            googleAccessToken: data.access_token,
            googleAccessTokenExpiresAt: moment().add(data.expires_in, 'seconds').toISOString()
        }
    });

    if(resSupabase.error) {
        throw resSupabase.error
    }

    return data.access_token;
}

export async function getCurrentUser(client?: SupabaseClient) {
    const supabase = await createClientIfNull(client);

    const { data: { user }, error } = await supabase.auth.getUser();

    if(error) {
        throw error;
    }

    return user;
}

export async function deleteAccount(client?: SupabaseClient) {

    const supabase = await createClientIfNull(client);

    const user = await getCurrentUser(supabase);

    if(!user) {
        throw new Error('User not logged in');
    }

    await supabase.auth.admin.deleteUser(user.id);
    
    await logout({ message: 'Your account and data associated with it has been deleted'}, supabase);
}

export async function afterDeleteAccount(dbUser: User) {
    return await deleteCustomerByCustomerID(dbUser.user_metadata.stripe_customer_id);
}