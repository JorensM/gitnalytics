import { createClientIfNull, getDBUserByEmail, getUserIDByEmail } from './auth';
import { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from './supabase/server';

describe('createClientIfNull()', () => {
    it('Should create and return supabase client if arg is undefined', async () => {
        const supabase = await createClientIfNull(undefined);

        expect(supabase?.auth).toBeDefined();
    });

    it('Should return the same supabase client that was provided, if it was provided', async () => {
        const ogSupabase = await createClient();

        const supabase = await createClientIfNull(ogSupabase);

        expect(supabase == ogSupabase).toBeTruthy();
    })
})

describe('getUserIDByEmail()', () => {
    it('Should return a user ID if there is a user with given email', async () => {
        const id = await getUserIDByEmail('email@found.com');

        expect(typeof id).toEqual('number');
    })
})

describe('getDBUserByEmail()', () => {
    it('Should return a user from DB by email', async () => {
        const user = await getDBUserByEmail('email@found.com');

        expect(user).not.toBeNull();
        expect(user?.email).toBeDefined();
    })

    it('Should return null if user with given email was not found', async () => {
        const user = await getDBUserByEmail('email@notfound.com');

        expect(user).toBeNull();
    });
})

describe('isLoggedInToGitHub', () => {
    it.todo('Should return true if')
})