import createStripeClient from './createStripeClient';
import { createClient } from './supabase/server';

export const getStripeCustomerID = async () => {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if(error){
        throw error;
    }
    const stripeCustomerID = user?.user_metadata.stripe_customer_id as string;
    return stripeCustomerID;
}

export const getSubscriptionActive = async () => {
    const stripe = createStripeClient();

    const stripeCustomerID = await getStripeCustomerID();

    const { data: subscriptions } = await stripe.subscriptions.list({
        customer: stripeCustomerID
    })

    if(subscriptions.length === 0) {
        return false;
    } else {
        return subscriptions.some(subscription => !subscription.ended_at)
    }
}