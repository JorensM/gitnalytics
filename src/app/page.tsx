import { createClient } from '@/util/supabase/server';
import Image from "next/image";
import Link from 'next/link';
import { redirect } from 'next/navigation';

const supabase = await createClient();

export default function Home() {

  async function login(formData: FormData) {
    "use server"
    const res = await supabase.auth.signInWithPassword({
      email: formData.get('email') as string,
      password: formData.get('password') as string
    })

    if(res.error) {
      throw res.error;
    }

    redirect('/dashboard')
  }

  return (
    <div className='h-full flex flex-col gap-8 items-center justify-center'>
      <form action={login} className='flex flex-col gap-2'>
        <h2>Login</h2>
        <input placeholder='Email' name='email' />
        <input type='password' placeholder='Password' name='password' />
        <button>Login</button>
      </form>
    </div>
  );
}
