'use client';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers'
import { redirect, useSearchParams } from 'next/navigation';
import { Router } from 'next/router';

export default async function TermsPage() {

    const _cookies = await cookies();

    const optedIn = _cookies.get('data-consent')?.value === 'true';

    const searchParams = useSearchParams();

    const justOptedOut = searchParams.get('optedOut') === 'true';

    if(justOptedOut) {
        alert('Please refresh the page for opt-out to take action');
    }

    return (
        <div className='p-8 max-w-[800px] flex flex-col gap-2'>
            <h2 className='text-xl font-bold'>Privacy Policy</h2>
            <h3 className='text-lg font-semibold'>User data</h3>
            <p>
                Upon registration, the following user data will be securely stored
                in our database: email address, Stripe client ID.
                <br/>
                Your (full or partial) payment information will be stored with Stripe, which can
                be accessed by us.
            </p>
            <h3 className='text-lg font-semibold'>User activity and statistics data</h3>
            <p>
                By default, this platform does not collect any data related to user
                activity, but you can opt in to participate in user activity data
                collection to help us improve the platform.
                If you agree to user activity data collection,
                this platform will collect the following anonymous data about user activity
                using Google Analytics:
            </p>
            <ul className='pl-2'>
                    <li>Visits</li>
                    <li>Non-specific page events (clicks, scrolls, page navigation)</li>
                    <li>Region and city</li>
                    <li>OS and browser type</li>
                    <li>Referring website</li>
                </ul>
            <p>
                You are currently {optedIn ? 'opted in' : 'not opted in'} to user activity data collection.<br/>
                If you wish to {optedIn ? 'opt out' : 'opt in'}, click the link below:
            </p>
            <form
                action={handleOptButtonClick}
            >
                <button
                    className='text-blue-400 border-none w-fit py-0 px-0 hover:bg-transparent hover:underline'
                >
                    {optedIn ? 'Opt out': 'Opt in'}
                </button>
            </form>
        </div>
    )
}