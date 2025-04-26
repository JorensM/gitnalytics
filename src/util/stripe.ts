import moment from 'moment';
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

export const getSubscriptionCancelled = async () => {
    const stripe = createStripeClient();

    const stripeCustomerID = await getStripeCustomerID();

    const { data: subscriptions } = await stripe.subscriptions.list({
        customer: stripeCustomerID
    })

    if(subscriptions.length === 0) {
        return false;
    } else {
        return subscriptions.every(subscription => subscription.canceled_at)
    }
}

export async function getSubscriptionStatus() {
    const stripe = createStripeClient();

    const stripeCustomerID = await getStripeCustomerID();

    const isActive = await getSubscriptionActive();
    const isCancelled = await getSubscriptionCancelled();
    const trial = null;
    let daysLeft;

    const { data: subscriptions } = await stripe.subscriptions.list({
        customer: stripeCustomerID
    })

    console.log(subscriptions);

    const subscription = subscriptions[0];

    if(isCancelled) {
        daysLeft = moment.unix(subscription.cancel_at!).diff(moment(), 'days');
    }

    const nextBillingDate = moment.unix(subscription.current_period_end).format('YYYY-MM-DD');

    return {
        isActive,
        isCancelled,
        daysLeft,
        nextBillingDate
    }
}

export async function getSubscriptionStatusMessage(_isActive?: boolean) {
    const stripe = createStripeClient();

    const stripeCustomerID = await getStripeCustomerID();

    const isActive = typeof _isActive === 'undefined' ? !(await getSubscriptionCancelled()) : _isActive;

    if(isActive) {
        return 'Subscription active';
    } else {
        const { data: subscriptions } = await stripe.subscriptions.list({
            customer: stripeCustomerID
        })
        const subscription = subscriptions[0];
        const daysLeft = moment.unix(subscription.cancel_at!).diff(moment(), 'days');
        return daysLeft + ' days until subscription ends';
    }
}