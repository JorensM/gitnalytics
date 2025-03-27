import { APP_URL } from '@/constants/envVars';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

//https://docs.stripe.com/billing/quickstart

export async function GET(request: NextRequest) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    const searchParams = request.nextUrl.searchParams;

    const params = {
      lookup_key: searchParams.get('lookup_key')!,
      email: searchParams.get('email')!,
      password: searchParams.get('password')!
    };

    console.log(request.nextUrl);
    console.log(params);

    console.log('params: ', params);
    const prices = await stripe.prices.list({
      lookup_keys: [params.lookup_key],
      expand: ['data.product'],
    });
    const session = await stripe.checkout.sessions.create({
      billing_address_collection: 'auto',
      line_items: [
        {
          price: prices.data[0].id,
          // For metered billing, do not pass quantity
          quantity: 1,
  
        },
      ],
      metadata: {
        email: params.email,
        password: params.password
      },
      subscription_data: {
        trial_period_days: 14
      },
      mode: 'subscription',
      success_url: `${process.env.APP_URL}/after-checkout?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_URL}/checkout?canceled=true`,
    });

    if(!session.url) {
      throw new Error('Could not retrieve session URL');
    }
  
    return NextResponse.redirect(session.url);
}