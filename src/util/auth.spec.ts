import { createClientIfNull, getDBUserByEmail, getUserIDByEmail, logout } from './auth';
import { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from './supabase/server';
import navigation from 'next/navigation';

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

        expect(typeof id).toEqual('string');
    })
})

describe('getDBUserByEmail()', () => {
    it('Should return a user from DB by email', async () => {
        const user = await getDBUserByEmail('email@found.com');

        expect(user).not.toBeNull();
        expect(user?.email).toBeDefined();
        expect(user?.user_metadata.stripe_customer_id).toBeDefined()
    })

    it('Should return null if user with given email was not found', async () => {
        const user = await getDBUserByEmail('email@notfound.com');

        expect(user).toBeNull();
    });
})

describe('isLoggedInToGitHub', () => {
    it.todo('Should return true if')
});

describe('logout()', () => {
    it('Should log user out and redirect to homepage', async () => {
        const supabase = await createClient();
        console.log('supabase', supabase);
        const logoutSpy = jest.spyOn(supabase.auth, 'signOut');
        const redirectSpy = jest.spyOn(navigation, 'redirect');

        await logout(supabase);

        expect(logoutSpy).toHaveBeenCalled();
        expect(redirectSpy).toHaveBeenCalledWith('/login?error=Stripe%20customer%20ID%20not%20found');
    });
})