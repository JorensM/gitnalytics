"use client"
import { createClient } from '@/util/supabase/client';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react'



export default async function Login() {
  
  const supabase = await createClient();
  const navigate = useRouter();

  const [error, setError] = useState<string | null>(null);

  async function login(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log(formData.get('email'));
    const res = await supabase.auth.signInWithPassword({
      email: formData.get('email') as string,
      password: formData.get('password') as string
    })

    if(res.error) {
      setError(res.error.message)
      throw res.error;
    }

    navigate.push('/dashboard');
  }

  return (
    <div className='h-full flex flex-col gap-8 items-center justify-center'>
      <form onSubmit={login} className='flex flex-col gap-2'>
        <h2>Login</h2>
        <input placeholder='Email' name='email' />
        <input type='password' placeholder='Password' name='password' />
        <span className='text-red-500'>{error}</span>
        <button>Login</button>
      </form>
    </div>
  );
}