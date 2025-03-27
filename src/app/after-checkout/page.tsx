'use client';

import { useSearchParams } from 'next/navigation';

export default function AfterCheckoutPage() {

    const searchParams = useSearchParams();

    const success = searchParams.get('success') === 'true';
    
    return (
        <div className='w-full h-full flex items-center justify-center'>
            {success ? 'Registration successful, please check your inbox for a confirmation email' : 'Uh-oh, something\'s not right'}
        </div>
    )
}