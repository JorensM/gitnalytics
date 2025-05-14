import { getStripeCustomerID, getSubscriptionActive } from './stripe';

let supabaseError = false;
let supabaseNoUser = false;
let subscriptionsToReturn: any[] = [];

beforeEach(() => {
    supabaseError = false;
    supabaseNoUser = false;
    subscriptionsToReturn = [];
})

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



describe('getStripeCustomerID()', () => {

    

    it('Should return the Stripe customer ID of the current customer', async () => {
        const customerID = await getStripeCustomerID();
        expect(customerID).toEqual('stripe_customer_id');
    })

    it('Should throw error if no user is logged in', async () => {
        supabaseNoUser = true;
        expect(getStripeCustomerID).rejects.toEqual('No user found');
    })

    it('Should throw error if supabase client returned error', async () => {
        supabaseError = true;
        expect(getStripeCustomerID).rejects.toContain('Supabase error:');
    })
});

describe('getSubscriptionActive()', () => {
    it('Should return false if there are no active subscriptions', async () => {
        let active = await getSubscriptionActive();
        expect(active).toBeFalsy();

        subscriptionsToReturn = [
            {
                ended_at: '123'
            },
            {
                ended_at: '123'
            }
        ];

        active = await getSubscriptionActive();
        expect(active).toBeFalsy();
    });

    it('Should return true if there is at least one active subscription', async () => {
        subscriptionsToReturn = [
            {},
            {
                ended_at: '123'
            }
        ];

        let active = await getSubscriptionActive();
        expect(active).toBeTruthy();

        subscriptionsToReturn = [
            {}
        ];

        active = await getSubscriptionActive();
        expect(active).toBeTruthy();
    })
});