import { createClient } from '@/util/supabase/server';
import Image from "next/image";
import Link from 'next/link';
import { redirect } from 'next/navigation';
import Stripe from 'stripe';

export default async function Home() {
    
    async function register(formData: FormData) {
        "use server";
        const supabase = await createClient();
        const data = {
            password: formData.get('password') as string
        }

        if(!data.password || data.password.length < 5){
            throw new Error('Password not valid');
        }

        const res = await supabase.auth.updateUser({
            password: data.password
        })

        if(res.error) {
            throw res.error
        }

        redirect('/login');
    }

    return (
        <div className='h-full flex flex-col gap-8 items-center justify-center'>
            <form action={register} className='flex flex-col gap-2'>
                <h2>Please set a password</h2>
                <input type='password' placeholder='Password' name='password' minLength={5} maxLength={32} required/>
                <button>Save password</button>
            </form>

        {/* <Link href='/register'>Login</Link> */}

        </div>
    );
}