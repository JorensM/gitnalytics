// 3rd party
import { SupabaseClient } from "@supabase/supabase-js";

// Utils
// import { createClient as createServerClient } from "@/util/supabase/server";
// import { createClient as createBrowserClient } from "@/util/supabase/client";
import AbstractDatabase from "./AbstractDatabase";

export default abstract class AbstractSupabase extends AbstractDatabase {

    client?: SupabaseClient;
    // createClient: () => Promise<SupabaseClient>;

    abstract createClient(): SupabaseClient;
    
    async init(): Promise<boolean> {
        this.client = this.createClient();
        console.log('Initializing db', this.client);
        // this.client = await this.createClient();
        return true;
    }

    async signIn(email: string, password: string): Promise<boolean> {
        // e.preventDefault();
        // setError(null);
        console.log(this.client);
        if(!this.client) {
            throw new Error('Supabase not initialized');
        }
        // const formData = new FormData(e.currentTarget);
        // console.log(formData.get('email'));
        const res = await this.client.auth.signInWithPassword({
            email,
            password
        });

        if(res.error) {
            throw res.error;
        }

        return true;
    }
};