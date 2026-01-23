import { SupabaseClient } from "@supabase/supabase-js";
import AbstractSupabase from "./AbstractSupabase";
import { createClient } from "@/util/supabase/server";

export default class SupabaseServer extends AbstractSupabase {
    async createClient(): Promise<SupabaseClient> {
        return await createClient();
    }
}