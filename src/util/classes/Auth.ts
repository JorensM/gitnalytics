import { SupabaseClient } from '@supabase/supabase-js';

export default class Auth {

    client: SupabaseClient;

    constructor(client: SupabaseClient) {
        this.client = client;
    }

    async getCurrentUser() {
        const supabase = this.client;
        
        const { data: { user }, error } = await supabase.auth.getUser();
    
        if(error) {
            console.error(error);
            return null;
        }
    
        return user;
    }

    async getCurrentSession() {
        console.log('Retrieving current session');
        const { data: { session }, error } = await this.client.auth.getSession();
        if(error){
            console.error(error);
        }

        return session;
    }
}