import AbstractDatabase from "@/classes/AbstractDatabase";
// import database from "@/classes/browserDB";
import Supabase from "@/classes/AbstractSupabase";
import { createClient } from "@/util/supabase/client";
import { useEffect, useRef } from "react";
import SupabaseBrowser from "@/classes/SupabaseBrowser";
import database from "@/classes/browserDB";

/**
 * Utility hook to access database (abstract)
 */
export default function useDB(client = database) {

    // const clientRef = useRef(new SupabaseBrowser());
    
    useEffect(() => {
        // clientRef.current.init();
        // clientRef.current.signIn('abc', 'abc');
    }, []);

    return {
        signIn: (email: string, password: string) => client.signIn(email, password)
    }
}