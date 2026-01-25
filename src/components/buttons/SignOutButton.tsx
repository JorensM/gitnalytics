"use client"

// import database from '@/classes/serverDB';
import useDB from '@/hooks/useDB';
// import useSupabase from '@/hooks/useSupabase';
// import { createClient } from '@/util/supabase/client'
import { revalidatePath } from 'next/cache';
import { usePathname, useRouter } from 'next/navigation';
// import { useEffect, useState } from 'react';

export default function SignOutButton() {

    const db = useDB();

    const router = useRouter();
    const pathname = usePathname();

    const onClick = () => {  
        (async () => {
            try {
                await db.signOut();
            } catch(error) {
                throw error;
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