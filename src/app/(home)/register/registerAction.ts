"use server";
import { getDBUserByEmail, getUserIDByEmail } from '@/util/auth';
import { redirect } from 'next/navigation';

export default async function register(formData: FormData) {

    const password = formData.get('password');
    const email = formData.get('email') as string;

    if(!email) {
        throw new Error('Email not provided');
    }

    const userID = await getUserIDByEmail(email);

    if(userID) {
        redirect('/register?error=Email%20already%20in%20use');
        // return;
    }

    redirect('/api/auth/checkout?lookup_key=' + process.env.STRIPE_SUBSCRIPTION_LOOKUP_KEY + '&password=' + password + '&email=' + email);
    // const supabase = await createClient();
    // const data = {
    //     password: formData.get('password') as string
    // }

    // if(!data.password || data.password.length < 5){
    //     throw new Error('Password not valid');
    // }

    // const res = await supabase.auth.updateUser({
    //     password: data.password
    // })

    // if(res.error) {
    //     throw res.error
    // }

    // redirect('/login');
}