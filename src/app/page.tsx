import { createClient } from '@/util/supabase/server';
import { revalidatePath } from 'next/cache';
import Image from "next/image";
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';


export default async function Home() {

  // redirect('/login');

  return (
    <div className='p-8 max-w-[1000px]'>
      <h2 className='text-2xl'>Track your visitor analytics alongside your Git commit history</h2>
      <img src='gitnalytics_2.PNG' className='w-full'/>
      <p>
        Gitnalytics allows you to map your Git commit history to your analytics
        to help you better understand which updates to your code leave the most
        impact.
      </p>
    </div>
  );
}
