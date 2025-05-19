/**
 * @jest-environment node
 */

import supabaseConfig from '@/__tests__/__mocks__/supabase';
import { DELETE } from './route';

describe.skip('/api/auth/account DELETE', () => {
    it('Should delete current user account', async () => {
        supabaseConfig.currentUser = {
            id: 'to_delete'
        };

        supabaseConfig.users = [supabaseConfig.currentUser];

        await DELETE();

        expect(supabaseConfig.currentUser).toBeNull();
        expect(supabaseConfig.users).toHaveLength(0);
    });

    it('Should return error response if user is not logged in', async () => {
        supabaseConfig.currentUser = null;

        const res = await DELETE();

        // const data = await res?.json();

        // expect(data.errorMessage).toBe('User not found');
        // expect(res?.status).toBe(400);
    })
})