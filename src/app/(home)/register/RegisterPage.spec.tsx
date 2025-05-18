import { render, screen } from '@testing-library/react';
import RegisterPage from './page';

describe('<RegisterPage />', () => {
    it('Should show error message if error param is set', async () => {
        jest.setTimeout(10 * 1000);
        // location.search = 'error=Error%20%message%20%test';
        const searchParams = async () => ({
            error: 'Error message test'
        })
        const page = await RegisterPage({ searchParams: searchParams() });
        render(page);

        const errorMessage = await screen.findByText('Error message test', undefined, { timeout: 5000});

        expect(errorMessage).toBeDefined();
    })
})