import { createClient } from '@/util/supabase/client';
import { SupabaseClient } from '@supabase/supabase-js';
import { useEffect, useRef } from 'react';

export default function useSupabase() {
    const supabaseRef = useRef<SupabaseClient>(null);

    useEffect(() => {
        (async () => {
            supabaseRef.current = await createClient()
        })()
    }, []);

    return supabaseRef;
}