jest.mock('./supabase/server', () => ({
    createClient: async () => ({
        auth: {
            getUser: () => {
                if(supabaseError) {
                    return {
                        data: {
                            user: null
                        },
                        error: 'error'
                    }
                } if(supabaseNoUser) {
                    return {
                        data: {
                            user: null
                        }
                    }
                } else {
                    return {
                        data: {
                            user: {
                                user_metadata: {
                                    stripe_customer_id: 'stripe_customer_id'
                                }
                            }
                        }
                    }
                }
            }
        }
    })
    
}))



jest.mock('./createStripeClient', () => () => ({
    subscriptions: {
        list: async (params: { customer: string }) => {
                return { data: subscriptionsToReturn }
        }
    }
}))