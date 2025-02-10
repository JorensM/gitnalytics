import useHydrated from '@/hooks/isHydrated';
import { createClient } from '@/util/supabase/server';
import { OAuth2Client } from 'google-auth-library';
import { redirect } from 'next/navigation';



export default async function GoogleSignIn() {

    const supabaseClient = await createClient();
    const user = await supabaseClient.auth.getUser();

    console.log(user.data.user?.user_metadata);

    const isSignedIn = !!user.data.user?.user_metadata.googleRefreshToken;

    const handleLogin = async () => {
        "use server"
        const redirectUri = process.env.APP_URL + '/api/auth/callback/google';
        console.log(redirectUri);
        const client = new OAuth2Client({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            redirectUri: redirectUri
        });
        const authUrl = client.generateAuthUrl({
            access_type: 'offline',
            scope: 'https://www.googleapis.com/auth/analytics.readonly',
            prompt: 'consent'
        })
        redirect(authUrl);
    }
    
    return isSignedIn ? '✔️ Signed in to Google' : <button className="max-w-[240px]" onClick={handleLogin}>Sign In To Google</button>
}