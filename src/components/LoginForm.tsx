'use client'

import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import { revalidatePath } from 'next/cache';
import useDB from '@/hooks/useDB';



export default function Login() {
  
  const db = useDB();
  const navigate = useRouter();

  const params = useSearchParams();

  const justSubscribed = params.get('subscribed') === 'true';
  const emailConfirmed = params.get('email_confirmed') === 'true';
  const passwordChanged = params.get('password_changed') === 'true';

  const [error, setError] = useState<string | null>(null);

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
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      await db.signIn(email, password);

      navigate.refresh();
      // revalidatePath('/login', 'layout');
      navigate.push('/dashboard');
    } catch (e: any) {
      setError(e.message)
    }
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