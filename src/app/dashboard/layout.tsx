import GoogleSignIn from '@/components/buttons/GoogleSignIn';
import GitHubSignIn from '@/components/buttons/GitHubSignIn';
import Link from 'next/link';
import createStripeClient from '@/util/createStripeClient';
import { createClient } from '@/util/supabase/server';
import { getSubscriptionActive } from '@/util/stripe';
import MailLink from '@/components/buttons/MailLink';
import { LayoutProps } from '../../../.next/types/app/dashboard/layout';

export default async function DashboardLayout(props: LayoutProps) {

    const isSubscriptionActive = await getSubscriptionActive();

    return (
        <div className='flex h-full'>
            <div className='flex gap-4 flex-col p-4 border-r border-neutral-800 h-full min-w-[220px] max-w-[400px]'>
                <h1><Link href='/dashboard'>Dashboard</Link></h1>
                <div className='flex flex-col gap-2 h-full'>
                    {isSubscriptionActive ? 
                    <>
                        <GoogleSignIn />
                        <GitHubSignIn />
                    </>    
                    : null}
                    <div className='flex flex-col mt-auto gap-4'>
                        <Link href='/dashboard/settings' className='text-neutral-400'>Settings</Link>
                        <MailLink text='Contact' className='text-sm'/>
                    </div>
                </div>
            </div>
            <div className='flex flex-col gap-4 p-4 flex-grow'>
                {props.children} 
            </div>
        </div>
    )
}