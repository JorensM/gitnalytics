import MailLink from '@/components/buttons/MailLink';
import { createClient } from '@/util/supabase/server';
import { revalidatePath } from 'next/cache';
import Image from "next/image";
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';
import Head from 'next/head';


export default async function Home() {

  // redirect('/login');

  return (
    <div className='flex flex-col p-8 max-w-[1000px] gap-4'>
      <Head>
        <link rel="canonical" href="https://gitnalytics.com" />
      </Head>
      <h2 className='text-2xl'>See how your code changes impact your visitors and sales.</h2>
      <img src='gitnalytics_2.PNG' className='w-full'/>
      <ul className='my-2 list-disc list-inside'>
        <li>Correlate Git commits with visitor traffic and revenue to measure real impact.</li>
        <li>Track your visitor and revenue analytics alongside your Git commit history.</li>
        <li>Link your GitHub commits with Google Analytics to understand which changes matter.</li>
      </ul>
      <p>
        Gitnalytics allows you to map/compare your Git commit history to your user analytics,
        such as visits, interactions, purchases, bounce rates, to help you better 
        understand which updates to your code leave the most impact.
      </p>
      <p>
        Currently there is only support for GitHub and Google Analytics but more
        platforms will be integrated eventually. If you have a feature request,
        feel free to reach out at <MailLink/>
      </p>
      
    </div>
  );
}
