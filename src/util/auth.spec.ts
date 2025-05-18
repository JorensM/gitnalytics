import { createClientIfNull, deleteAccount, getCurrentUser, getDBUserByEmail, getUserIDByEmail, logout} from './auth';
import { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from './supabase/server';
import navigation from 'next/navigation';
import supabaseConfig from '@/__tests__/__mocks__/supabase';

// const auth = { logout };

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

        await logout(undefined, supabase);

        expect(logoutSpy).toHaveBeenCalled();
    });
});

describe('getCurrentUser()', () => {
    it('Should return current user or null if user is not logged in', async () => {

        const supabase = await createClient();
        
        const user = await getCurrentUser(supabase);

        expect(user?.id).toBeDefined();

        supabaseConfig.currentUser = null;

        const newUser = await getCurrentUser(supabase);

        expect(newUser).toBeNull();
    })
})

describe('deleteAccount()', () => {
    it('Should log user out and delete their account', async () => {
        const supabase = await createClient();

        const userID = supabaseConfig.currentUser?.id;

        // const logoutSpy = jest.spyOn(auth, 'logout');
        const deleteSpy = jest.spyOn(supabase.auth.admin, 'deleteUser');
        const redirectSpy = jest.spyOn(navigation, 'redirect');
        // await supabase.auth.admin.deleteUser()

        await deleteAccount(supabase);

        // expect(logoutSpy).toHaveBeenCalled();
        expect(supabaseConfig.currentUser).toBeNull();
        expect(deleteSpy).toHaveBeenCalledWith(userID);
        const message = 'Your account and data associated with it has been deleted';
        expect(redirectSpy).toHaveBeenCalledWith('/login?message=' + encodeURIComponent(message));
    });
});

describe('afterDeleteAccount()', () => {
    it('Should delete Stripe customer', async () => {



        await afterDeleteAccount(supabaseConfig.currentUser);
    });
});