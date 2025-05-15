import Stripe from 'stripe';
import createStripeClient from './createStripeClient';

const OLD_ENV = process.env.STRIPE_SECRET_KEY;

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ test: 100 }),
  }),
) as jest.Mock;

describe('createStripeClient()', () => {

    afterAll(() => {
        process.env.STRIPE_SECRET_KEY = OLD_ENV;
    })

    it('Should return an instance of Stripe', () => {
        const stripe = createStripeClient();

        expect(stripe).toBeInstanceOf(Stripe);
    })
    it('Should throw error if STRIPE_SECRET_KEY env var is not provided', async () => {
        process.env.STRIPE_SECRET_KEY = '';

        expect(createStripeClient).toThrow();
    })

})