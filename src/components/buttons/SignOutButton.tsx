"use client"

import useSupabase from '@/hooks/useSupabase';
import { createClient } from '@/util/supabase/client'
import { revalidatePath } from 'next/cache';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SignOutButton() {

    const supabase = useSupabase();

    const router = useRouter();
    const pathname = usePathname();

    const onClick = () => {  
        (async () => {
            
            const res = await supabase.current!.auth.signOut();
            if(res.error) {
                throw res.error;
            }
    
            router.refresh();
            revalidatePath(pathname, 'layout');
            router.push('/login');

        })(); 
    }
    
    return (
        <button
            onClick={onClick}
        >
            Sign out
        </button>
    )
}