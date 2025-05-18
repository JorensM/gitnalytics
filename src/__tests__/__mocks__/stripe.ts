// import './common';
import '@/util/createStripeClient';

type Subscription = { 
    canceled_at?: number, 
    ended_at?: number,
    cancel_at?: number,
    current_period_end?: number
}

const stripeConfig: {
    subscriptionsToReturn: Subscription[],
} = {
    subscriptionsToReturn: []
}

jest.mock('../../util/createStripeClient', () => () => ({
    subscriptions: {
        list: async (params: { customer: string }) => {
                if(params.customer === 'stripe_customer_id') {
                    return { data: stripeConfig.subscriptionsToReturn }
                } else {
                    throw new Error("No such customer: '" + params.customer + "'")
                }
        }
    }
}));

beforeEach(() => {
    stripeConfig.subscriptionsToReturn = [];
})

export default stripeConfig;