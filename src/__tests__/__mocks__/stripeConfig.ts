type Subscription = { 
    canceled_at?: number, 
    ended_at?: number,
    cancel_at?: number,
    current_period_end?: number
};

type Customer = {
    id: string
}

const stripeConfig: {
    subscriptionsToReturn: Subscription[],
    customers: Customer[]
} = {
    subscriptionsToReturn: [],
    customers: []
}

export default stripeConfig;