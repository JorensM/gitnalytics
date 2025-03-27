import Stripe from 'stripe';

export default function createStripeClient() {
    return new Stripe(process.env.STRIPE_SECRET_KEY!);
}