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
                    <Link href='/register' className='button-secondary-outline'>
                        Sign up
                    </Link>
                : null}
            </div>
        )
    } else {
        return null;
    }
}
