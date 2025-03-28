import createStripeClient from '@/util/createStripeClient';
import { createClient } from '@/util/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {

    const data = await request.json();

    const { type: eventType } = data;

    if(eventType !== 'customer.subscription.deleted') {
        return new NextResponse();
    }

    // const customerId = data.data.object.customer;

    // const stripe = createStripeClient();
    // const supabase = await createClient();

    // const customer = await stripe.customers.retrieve(customerId);

    // if(!customer || customer.deleted) {
    //     throw new Error('Could not find Stripe customer data');
    // }

    // console.log('customer: ', customer);
    
    // const supabaseRes = await supabase.auth.admin.deleteUser(customer.metadata.gitnalytics_user_id);

    // if(supabaseRes.error) {
    //     throw supabaseRes.error;
    // }

    return new NextResponse();
}