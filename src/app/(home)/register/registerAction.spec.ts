import navigation from 'next/navigation';
import register from './registerAction';

describe('registerAction()', () => {
    it('Should redirect to api/auth/checkout with correct search params', async () => {
        const spy = jest.spyOn(navigation, 'redirect');

        const password = 'password';
        const email = 'email@notfound.com';

        const formData = new FormData();
        formData.set('password', password);
        formData.set('email', email);

        await register(formData);

        expect(spy).toHaveBeenCalledWith('/api/auth/checkout?lookup_key=' + process.env.STRIPE_SUBSCRIPTION_LOOKUP_KEY + '&password=' + password + '&email=' + email);
    })
    it('Should redirect to /register?error=Email%20already%20in%20use if email is already in use', async () => {
        const spy = jest.spyOn(navigation, 'redirect');

        const password = 'password';
        const email = 'email@found.com';

        const formData = new FormData();
        formData.set('password', password);
        formData.set('email', email);

        await register(formData);

        expect(spy).toHaveBeenCalledWith('/register?error=Email%20already%20in%20use');
    });

    it('Should throw error if form data is not valid', async () => {
        const password = 'password';
        const email = '';

        const formData = new FormData();
        formData.set('password', password);
        formData.set('email', email);

        expect(register(formData)).rejects.toBeDefined();
    })
})