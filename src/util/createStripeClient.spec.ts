import Stripe from 'stripe';
import createStripeClient, { createStripeClientIfNull } from './createStripeClient';

const OLD_ENV = process.env.STRIPE_SECRET_KEY;

describe('createStripeClient()', () => {

    afterAll(() => {
        process.env.STRIPE_SECRET_KEY = OLD_ENV;
    })

    it('Should return an instance of Stripe', () => {
        const stripe = createStripeClient();

        expect(stripe.subscriptions).toBeDefined();
    });
    
    it.failing('Should throw error if STRIPE_SECRET_KEY env var is not provided', async () => {
        process.env.STRIPE_SECRET_KEY = '';

        expect(createStripeClient).toThrow();
    })

})

describe('createStripeClientIfNull()', () => {
    it('Should return a new instance if none is provided', () => {
        const stripe = createStripeClientIfNull();

        expect(stripe.subscriptions).toBeDefined();
    })

    it('Should return same instance if provided', () => {

        const stripe = createStripeClient();

        const sameStripe = createStripeClientIfNull(stripe);

        expect(stripe === sameStripe).toBeTruthy();
    })
})