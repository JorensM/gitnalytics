'use client';
import { createClient } from '@/util/supabase/client';
import Image from "next/image";
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { FormEvent, useState } from 'react';
import Stripe from 'stripe';

export default function PasswordResetForm() {
    
    const [error, setError] = useState<null | string>(null);

    async function changePassword(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        try {
            const formData = new FormData(e.currentTarget);
            const supabase = await createClient();
            const data = {
                password: formData.get('password') as string,
                password_confirm: formData.get('password_confirm') as string
            }
    
            
            if(!data.password || data.password.length < 5){
                throw new Error('Password not valid');
            }
    
            if(data.password !== data.password_confirm) {
                throw new Error('Passwords do not match');
            }
    
            const res = await supabase.auth.updateUser({
                password: data.password
            })
    
            if(res.error) {
                throw res.error
            }
    
            await supabase.auth.signOut();
        } catch (_e) {
            const e = _e as Error;
            setError(e.message);
        }

        if(!error) {
            redirect('/login?password_changed=true');
        }
    }

    return (
        <div className='h-full flex flex-col gap-8 max-w-[400px]'>
            <form onSubmit={changePassword} className='flex flex-col gap-2'>
                <h2>Please set a password</h2>
                <input type='password' placeholder='Password' name='password' minLength={5} maxLength={32} required/>
                <input type='password' placeholder='Confirm Password' name='password_confirm' minLength={5} maxLength={32} required/>
                {error ? <span className='form-error'>{error}</span> : null}
                <button>Save password</button>
            </form>

        {/* <Link href='/register'>Login</Link> */}

        </div>
    );
}