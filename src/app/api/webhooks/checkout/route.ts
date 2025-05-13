import { APP_URL } from '@/constants/envVars';
import { createClient } from '@/util/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// This webhook is called upon successful checkout of a 
// new user. It should create an account for the new user
// with the credentials based on the provided metadata in the request
// body
export async function POST(request: NextRequest) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    const data = await request.json();

    const { type: event_type } = data;

    if(event_type !== 'checkout.session.completed') {
        return new NextResponse();
    }

    // console.log('data: ', data);

    const { metadata, customer } = data.data.object;

    if(metadata.existing_customer) {
        return new NextResponse();
    }

    const supabase = await createClient();

    const { data: { user } , error } = await supabase.auth.signUp({
        email: metadata.email,
        password: metadata.password,
        options: {
            data: {
                stripe_customer_id: customer
            },
            emailRedirectTo: APP_URL + '/login?email_confirmed=true'
        }
    })

    if(error) {
        throw new Error('Error creating an account: ' + error.message);
    }

    if(!user) {
        throw new Error('User not found')
    }

    const stripeRes = await stripe.customers.update(customer, {
        metadata: {
            gitnalytics_user_id: user.id
        }
    })

    if(stripeRes.lastResponse.statusCode !== 200) {
        throw new Error('Could not update Stripe customer');
    }

    return new NextResponse();
}