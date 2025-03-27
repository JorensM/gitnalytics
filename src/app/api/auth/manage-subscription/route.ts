import { APP_URL } from '@/constants/envVars';
import { createClient } from '@/util/supabase/server';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function GET() {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if(!user) {
        throw new Error('User not authenticated');
    }

    const stripeCustomerId = user?.user_metadata.stripe_customer_id;

    if(!stripeCustomerId) {
        throw new Error('Could not retrive Stripe customer ID');
    }

    // This is the url to which the customer will be redirected when they're done
    // managing their billing with the portal.
    const returnUrl = APP_URL + '/dashboard';

    const portalSession = await stripe.billingPortal.sessions.create({
        customer: stripeCustomerId,
        return_url: returnUrl,
    });

    return NextResponse.redirect(portalSession.url);
}