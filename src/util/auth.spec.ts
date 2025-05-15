import { createClientIfNull } from './auth';
import { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from './supabase/server';

describe('createClientIfNull()', () => {
    it('Should create and return supabase client if arg is undefined', async () => {
        const supabase = await createClientIfNull(undefined);

        expect(supabase).toBeInstanceOf(SupabaseClient);
    });

    it('Should return the same supabase client that was provided, if it was provided', async () => {
        const ogSupabase = await createClient();

        const supabase = await createClientIfNull(ogSupabase);

        expect(supabase == ogSupabase).toBeTruthy();
    })
})

describe('isLoggedInToGitHub', () => {
    it.todo('Should return true if')
})