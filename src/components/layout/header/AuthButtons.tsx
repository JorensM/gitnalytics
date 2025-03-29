"use client"

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AuthButtons() {

    const pathname = usePathname();

    const showLoginButton = ['/', '/register'].includes(pathname);
    const showRegisterButton = ['/', '/login'].includes(pathname);

    const showAnything = showLoginButton || showRegisterButton;

    if(showAnything) {
        return (
            <div className='w-fit flex gap-8 items-center'>
                {showLoginButton ? 
                    <Link href='/login'>
                        Sign In
                    </Link>
                : null}
                {showRegisterButton ? 
                    <Link href='/register' className='border border-blue-800 p-2 text-blue-500 hover:bg-blue-800 hover:text-blue-200 rounded-sm'>
                        Register
                    </Link>
                : null}
            </div>
        )
    } else {
        return null;
    }
}