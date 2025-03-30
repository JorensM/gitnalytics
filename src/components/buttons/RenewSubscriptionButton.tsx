import { getStripeCustomerID, getSubscriptionActive } from '@/util/stripe'
import Link from 'next/link';

export default async function RenewSubscriptionButton() {

    const isSubscriptionActive = await getSubscriptionActive();
    const stripeCustomerID = await getStripeCustomerID();

    if(isSubscriptionActive) {
        return (
            <span className='text-sm text-green-500'>
                Subscription active
            </span>
        )
    }
    return (
        <Link href={'/api/auth/checkout?lookup_key=' + process.env.STRIPE_SUBSCRIPTION_LOOKUP_KEY + '&customer=' + stripeCustomerID}>
            Renew Subscription
        </Link>
    )
}