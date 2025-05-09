import { getStripeCustomerID, getSubscriptionActive, getSubscriptionStatus, getSubscriptionStatusMessage } from '@/util/stripe'
import clsx from 'clsx';
import Link from 'next/link';

export default async function RenewSubscriptionButton() {

    const isSubscriptionActive = await getSubscriptionActive();
    const stripeCustomerID = await getStripeCustomerID();
    const subscriptionStatus = await getSubscriptionStatus();

    if(subscriptionStatus.isActive) {
        return (
            <div className='flex flex-col'>
                <span className={clsx('text-sm', subscriptionStatus.isCancelled ? 'text-orange-500' : 'text-green-500')}>
                    {await getSubscriptionStatusMessage()}
                </span>
                <span className='text-neutral-500'>
                    Next billing date on {subscriptionStatus.nextBillingDate}
                </span>
            </div>
        )
    }
    return (
        <Link href={'/api/auth/checkout?lookup_key=' + process.env.STRIPE_SUBSCRIPTION_LOOKUP_KEY + '&customer=' + stripeCustomerID}>
            Renew Subscription
        </Link>
    )
}