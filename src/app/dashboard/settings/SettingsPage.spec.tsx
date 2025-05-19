import supabaseConfig from '@/__tests__/__mocks__/supabase';
import stripeConfig from '@/__tests__/__mocks__/stripeConfig';
import SettingsPage from './page'
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { APP_URL } from '@/constants/envVars';

jest.mock('../../../components/buttons/RenewSubscriptionButton', () => () => null);

describe('<SettingsPage/>', () => {
    it('Should have a delete account button which deletes account upon click', async () => {
            // await act(async () => {
            supabaseConfig.currentUser = {
                id: 'to_delete',
                email: 'user@mail.com',
                user_metadata: {
                    stripe_customer_id: 'customer_id'
                }
            };

            supabaseConfig.users = [supabaseConfig.currentUser];

            // stripeConfig.customers = [{
            //     id: 'customer_id'
            // }];

            const user = userEvent.setup();

            const _page = await SettingsPage();

            render(_page);

            const promptSpy = jest.spyOn(window, 'prompt').mockReturnValue('user@mail.com');
            const alertSpy = jest.spyOn(window, 'alert');
            const fetchSpy = jest.spyOn(global, 'fetch');
    
            const deleteButton = await screen.findByText('Delete Account', undefined, { timeout: 15 * 1000 });
    
            expect(deleteButton.tagName).toBe('BUTTON');

            await user.click(deleteButton);

            expect(promptSpy).toHaveBeenCalledWith(
                'Are you sure you want to delete your account? This action is irreversible ' + 
                'and will delete all your user data and cancel your subscription. ' +
                'Please enter your email to confirm deletion.'
            );

            expect(alertSpy).not.toHaveBeenCalled();

            expect(supabaseConfig.currentUser).toBeNull();
            expect(supabaseConfig.users).toHaveLength(0);

            // expect(fetchSpy).toHaveBeenCalledWith(APP_URL + '/api/auth/account', {
            //     method: 'DELETE',
            //     headers: {
            //         'Authorization': 'Bearer ' + supabaseConfig.session.access_token
            //     }
            // });
    })

    it.skip('Should not do anything but just close prompt if user cancels prompt', async () => {
        const user = userEvent.setup();

        const _page = await SettingsPage();

        render(_page);

        const deleteButton = await screen.findByText('Delete Account', undefined, { timeout: 15 * 1000 });

        const promptSpy = jest.spyOn(window, 'prompt').mockReturnValue('wrong@email.com');

        user.click(deleteButton);

        expect
    })
})