import moment from 'moment';
// import createStripeClient from './createStripeClient';
// import { createClient } from './supabase/server';

export const getStripeCustomerID = async () => {
    // const supabase = await createClient();
    // const { data: { user }, error } = await supabase.auth.getUser();
    // if(error){
    //     throw 'Supabase error: ' + error;
    // }
    // if(!user) {
    //     throw 'No user found';
    // }
    // const stripeCustomerID = user?.user_metadata.stripe_customer_id as string;
    // return stripeCustomerID;
}

export const getSubscriptionActive = async () => {
    return true;
    // const stripe = createStripeClient();

    // const stripeCustomerID = await getStripeCustomerID();

    // const { data: subscriptions } = await stripe.subscriptions.list({
    //     customer: stripeCustomerID
    // })

    // if(subscriptions.length === 0) {
    //     return false;
    // } else {
    //     return subscriptions.some(subscription => !subscription.ended_at)
    // }
}

export const getSubscriptionCancelled = async () => {
    return false;
    // const stripe = createStripeClient();

    // const stripeCustomerID = await getStripeCustomerID();

    // const { data: subscriptions } = await stripe.subscriptions.list({
    //     customer: stripeCustomerID
    // })

    // if(subscriptions.length === 0) {
    //     return true;
    // } else {
    //     return subscriptions.every(subscription => subscription.canceled_at)
    // }
}

export async function getSubscriptionStatus() {
    // const stripe = createStripeClient();

    // const stripeCustomerID = await getStripeCustomerID();

    const isActive = await getSubscriptionActive();
    const isCancelled = await getSubscriptionCancelled();
    const trial = null;
    let daysLeft = 0;

    // const { data: subscriptions } = await stripe.subscriptions.list({
    //     customer: stripeCustomerID
    // })

    // console.log(subscriptions);

    // const subscription = subscriptions[0];

    // let nextBillingDate;

    // if(isCancelled && subscriptions.length) {
    //     daysLeft = moment.unix(subscription.cancel_at!).diff(moment(), 'days');
    // } else if(subscriptions.length) {
    //     nextBillingDate = moment.unix(subscription.current_period_end).format('YYYY-MM-DD');
    // }


    return {
        isActive,
        isCancelled,
        daysLeft: 15,
        nextBillingDate: 15,
        ended: false//isCancelled && (!daysLeft || daysLeft < 1)
    }
}

// todo: Refactor to not be async and not depend on stripe functions, rather just accept a subscriptionStatus arg
export async function getSubscriptionStatusMessage(_isActive?: boolean) {
    return "message";
    // const stripe = createStripeClient();

    // const stripeCustomerID = await getStripeCustomerID();

    // const isActive = typeof _isActive === 'undefined' ? !(await getSubscriptionCancelled()) : _isActive;

    // const subscriptionStatus = await getSubscriptionStatus();

    // if(isActive) {
    //     return 'Subscription active';
    // } else if(subscriptionStatus.ended) {
    //     return 'Subscription ended';
    // } else {
    //     const { data: subscriptions } = await stripe.subscriptions.list({
    //         customer: stripeCustomerID
    //     })
    //     const subscription = subscriptions[0];
    //     const daysLeft = moment.unix(subscription.cancel_at!).diff(moment(), 'days');
    //     return daysLeft + ' days until subscription ends';
    // }
}
