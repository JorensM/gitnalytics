import { APP_URL } from '@/constants/envVars';
import useHydrated from '@/hooks/isHydrated';
import { createClient } from '@/util/supabase/server';
import { OAuth2Client } from 'google-auth-library';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export default async function GoogleSignIn() {
    const supabaseClient = await createClient();
    const user = await supabaseClient.auth.getUser();

    const isSignedIn = !!user.data.user?.user_metadata.googleRefreshToken;

    const handleLogin = async () => {
        "use server"
        try {
            const redirectUri = APP_URL + '/api/auth/callback/google';
            const client = new OAuth2Client({
                clientId: process.env.GOOGLE_CLIENT_ID!,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
                redirectUri: redirectUri
            });
            const authUrl = client.generateAuthUrl({
                access_type: 'offline',
                scope: 'https://www.googleapis.com/auth/analytics.readonly',
                prompt: 'consent'
            });
            redirect(authUrl);
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    const handleLogout = async () => {
        "use server"
        try {
            const supabaseClient = await createClient();
            const client = new OAuth2Client({
                clientId: process.env.GOOGLE_CLIENT_ID!,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            });

            const { data: { user } } = await supabaseClient.auth.getUser();
            const access_token = user?.user_metadata.googleAccessToken;
            const refresh_token = user?.user_metadata.googleRefreshToken;
            if (!access_token && !refresh_token) {
                redirect('./');
                return;
            }

            await client.setCredentials({
                refresh_token,
                access_token
            });
            await client.revokeCredentials();
            await supabaseClient.auth.updateUser({
                data: {
                    googleAccessToken: null,
                    googleRefreshToken: null
                }
            });

            redirect('./');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return isSignedIn ? 
        <div className='flex flex-col'>
            <span>✔️ Signed in to Google</span>
            <button className='border-none h-fit w-fit text-sm text-neutral-500' onClick={handleLogout}>Sign out</button>
        </div> 
        : 
        <button className="w-full" onClick={handleLogin}>Sign In To Google</button>
}