import '@/util/supabase/server'

type Subscription = { 
    canceled_at?: number, 
    ended_at?: number,
    cancel_at?: number,
    current_period_end?: number
}

const supabaseConfig: {
    subscriptionsToReturn: Subscription[],
    supabaseError: boolean,
    supabaseNoUser: boolean,
    users: any[]
} = {
    supabaseError: false,
    supabaseNoUser: false,
    subscriptionsToReturn: [],
    users: [
        {
            email: 'email@found.com',
            id: 4
        }
    ]
};

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ test: 100 }),
  }),
) as jest.Mock;

const supabaseResponse = (data: any, error?: string) => {
    return {
        data,
        error
    }
}

jest.mock('../../util/supabase/server', () => ({
    createClient: async () => ({
        auth: {
            getUser: () => {
                if(supabaseConfig.supabaseError) {
                    return {
                        data: {
                            user: null
                        },
                        error: 'error'
                    }
                } if(supabaseConfig.supabaseNoUser) {
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
            },
            admin: {
                getUserById: async (id: number) => {
                    const user = supabaseConfig.users.find(user => user.id === id);
                    return {
                        data: { user },
                        error: !user ? 'User not found' : undefined
                    }
                }
            }
        },
        rpc: async (functionName: string, params: Record<string, any>) => {
            if(functionName === 'get_user_id_by_email') {
                if(params.p_email === 'email@found.com'){
                    return {
                        data: 4
                    }
                } else {
                    // todo check if this is actually what the rpc function returns when user is not found
                    return {
                        data: null
                    };
                }
            }
        }
    })
    
}))



jest.mock('../../util/createStripeClient', () => () => ({
    subscriptions: {
        list: async (params: { customer: string }) => {
                return { data: supabaseConfig.subscriptionsToReturn }
        }
    }
}))

export default supabaseConfig;