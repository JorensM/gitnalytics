import MailLink from '@/components/buttons/MailLink';
import { createClient } from '@/util/supabase/server';
import Image from "next/image";
import Link from 'next/link';
import { redirect } from 'next/navigation';
import Stripe from 'stripe';

export default async function RegisterPage() {
    
    async function register(formData: FormData) {
        "use server";

        const password = formData.get('password');
        const email = formData.get('email');

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

    return (
        <div className='h-full flex flex-col gap-8 items-center justify-center'>
            <form action={register} className='flex flex-col gap-2 max-w-[240px]'>
                <h2>Register</h2>
                <input type='email' placeholder='Email' name='email' required/>
                <input type='password' placeholder='Password' name='password' minLength={5} maxLength={32} required/>
                <p className='w-full text-sm'>
                    After clicking 'Register', you will be taken to a Stripe Checkout page, and your 14 day trial will start.
                    (8 euros/month after trial ends)
                </p>
                <button>Register</button>
                <p className='text-sm'>
                    If you'd like to get a demo before registering, please reach out at
                    <MailLink />
                </p>
            </form>
        </div>
    );
}