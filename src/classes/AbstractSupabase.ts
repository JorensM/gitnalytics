// 3rd party
import { SupabaseClient } from "@supabase/supabase-js";

// Utils
// import { createClient as createServerClient } from "@/util/supabase/server";
// import { createClient as createBrowserClient } from "@/util/supabase/client";
import AbstractDatabase, { UserAttributes, User } from "./AbstractDatabase";
import { APP_URL } from "@/constants/envVars";

export default abstract class AbstractSupabase extends AbstractDatabase {

    client?: SupabaseClient;
    // createClient: () => Promise<SupabaseClient>;

    abstract createClient(): Promise<SupabaseClient>;
    
    async init(): Promise<boolean> {
        this.client = await this.createClient();
        console.log('Initializing db', this.client);
        // this.client = await this.createClient();
        return true;
    }

    async signUp(email: string, password: string, stripe_customer_id: string): Promise<User | null> {
        const { data: { user } , error } = await this.client!.auth.signUp({
            email,
            password,
            options: {
                data: {
                    stripe_customer_id
                },
                emailRedirectTo: APP_URL + '/login?email_confirmed=true'
            }
        });

        if(error) {
            throw error;
        }

        return user;
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

    async signOut(): Promise<boolean> {
        const res = await this.client?.auth.signOut();
        if(res?.error) {
            throw res.error;
        }
        return true;
    }

    async updateUser(attributes: Partial<UserAttributes>): Promise<boolean> {
        const res = await this.client?.auth.updateUser(attributes);
        if(res?.error) {
            throw res.error;
        }
        return true;
    }

    async getUser(): Promise<User | null> {
        const res = await this.client!.auth.getUser();
        if(res.error) {
            throw res.error;
        }
        return res.data.user;
    }    
};