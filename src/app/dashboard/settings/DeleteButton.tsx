'use client';

import Auth from '@/util/classes/Auth';
import { createClient } from '@/util/supabase/client';
import { ButtonHTMLAttributes, HTMLAttributes, MouseEvent, useRef, useState } from 'react';

export default function DeleteAccountButton( props: ButtonHTMLAttributes<HTMLButtonElement>) {

    const [email, setEmail] = useState<string>('');
    const emailInputRef = useRef<HTMLInputElement>(null);
    // const emailRef = useRef<string | undefined>(undefined);

    const handleClick = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const form = e.currentTarget.form;
        const db = await createClient();

        const email = prompt(
            'Are you sure you want to delete your account? This action is irreversible and will delete all your user data and cancel your subscription. Please enter your email to confirm deletion.'
        );

        if(email === null) return;

        const auth = new Auth(db);

        const user = await auth.getCurrentUser();

        if(email !== user?.email) {
            alert('Incorrect email');
        } else {
            emailInputRef.current!.value = email;
            form?.requestSubmit();
        }

        // Refactor to make API call
        // APIDeleteAccount(email).then((res) => {
        //     if(res.status !== 200) {
        //         alert(res.errorMessage);
        //     }
        // });
    }

    return (
        <>
            <button
                onClick={handleClick}
                // {...props}
            >
                Delete Account
            </button>
            <input ref={emailInputRef} hidden name='email' readOnly/>
        </>
    )
}