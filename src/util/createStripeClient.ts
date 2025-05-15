import Stripe from 'stripe';

export default function createStripeClient() {
    console.log(process.env.STRIPE_SECRET_KEY);
    if(!process.env.STRIPE_SECRET_KEY) {
        console.log('throwing');
        throw new Error('STRIPE_SECRET_KEY env var not set')
    }
    return new Stripe(process.env.STRIPE_SECRET_KEY!);
}