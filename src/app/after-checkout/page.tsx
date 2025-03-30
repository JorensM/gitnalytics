'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function AfterCheckoutPage() {

    const searchParams = useSearchParams();

    const success = searchParams.get('success') === 'true';
    const renewed = searchParams.get('renewed') === 'true';
    
    return (
        <div className='w-full h-full flex items-center justify-center'>
            {
                renewed ? 
                    <span className='flex flex-col items-center'>Your subscription has been renewed. <br/> <Link href='/dashboard'>To Dashboard</Link></span> :
                success ? 
                    'Registration successful, please check your inbox for a confirmation email' : 
                'Uh-oh, something\'s not right'
            }
        </div>
    )
}