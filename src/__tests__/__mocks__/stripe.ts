
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
                return { data: stripeConfig.subscriptionsToReturn }
        }
    }
}));

export default stripeConfig;