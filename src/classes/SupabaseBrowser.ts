import { SupabaseClient } from "@supabase/supabase-js";
import AbstractSupabase from "./AbstractSupabase";
import { createClient } from "@/util/supabase/client";

export default class SupabaseBrowser extends AbstractSupabase {
    createClient(): SupabaseClient {
        return createClient();
    }
}