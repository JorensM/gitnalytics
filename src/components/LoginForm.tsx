'use client'

import { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/util/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import useSupabase from '@/hooks/useSupabase';
import { revalidatePath } from 'next/cache';



export default function Login() {
  
  const supabase = useSupabase();
  const navigate = useRouter();

  const params = useSearchParams();

  const justSubscribed = params.get('subscribed') === 'true';
  const emailConfirmed = params.get('email_confirmed') === 'true';
  const passwordChanged = params.get('password_changed') === 'true';

  const [error, setError] = useState<string | null>(params.get('error'));

  const message = useMemo(() => (
    justSubscribed ? 
      'Subscription successful, please confirm your email'
    : emailConfirmed ? 
      'Email confirmed, you may now log in'
    : passwordChanged ?
      'Password changed, please re-login'
    : null
  ), []);

  async function login(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if(!supabase.current) {
        throw new Error('Supabase not initialized');
    }
    const formData = new FormData(e.currentTarget);
    // console.log(formData.get('email'));
    const res = await supabase.current.auth.signInWithPassword({
      email: formData.get('email') as string,
      password: formData.get('password') as string
    })

    if(res.error) {
      setError(res.error.message)
      //throw res.error;
    }

    navigate.refresh();
    revalidatePath('/login', 'layout');
    navigate.push('/dashboard');
  }

  return (
    <div className='h-full flex flex-col gap-8 items-center justify-center'>
      <form onSubmit={login} className='flex flex-col gap-2'>
        <h2>Login</h2>
        {message}
        <input placeholder='Email' name='email' />
        <input type='password' placeholder='Password' name='password' />
        <span className='text-red-500'>{error}</span>
        <button>Login</button>
      </form>
    </div>
  );
}