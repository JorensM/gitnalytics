import moment from 'moment';
import { getStripeCustomerID, getSubscriptionActive, getSubscriptionCancelled, getSubscriptionStatus } from './stripe';

let supabaseError = false;
let supabaseNoUser = false;
let subscriptionsToReturn: { canceled_at?: number, ended_at?: number }[] = [];

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
                ended_at: 123
            },
            {
                ended_at: 123
            }
        ];

        active = await getSubscriptionActive();
        expect(active).toBeFalsy();
    });

    it('Should return true if there is at least one active subscription', async () => {
        subscriptionsToReturn = [
            {},
            {
                ended_at: 123
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

describe('getSubscriptionCancelled()', () => {
    it('Should return true if there are no active subscriptions or all subscriptions have been cancelled', async () => {
        let active = await getSubscriptionCancelled();
        expect(active).toBeTruthy();

        subscriptionsToReturn = [
            {
                canceled_at: 123
            },
            {
                canceled_at: 123
            }
        ];

        active = await getSubscriptionCancelled();
        expect(active).toBeTruthy();
    });

    it('Should return false if there is at least one active subscription', async () => {
        subscriptionsToReturn = [
            {
                canceled_at: 123
            },
            {}
        ];

        let active = await getSubscriptionCancelled();
        expect(active).toBeFalsy();

        subscriptionsToReturn = [
            {}
        ];

        active = await getSubscriptionCancelled();
        expect(active).toBeFalsy();
    })
})

describe('getSubscriptionStatus()', () => {
    it('Should return isActive: true if subscription is active', async () => {

        subscriptionsToReturn = [
            {}
        ]

        const status = await getSubscriptionStatus();

        expect(status.isActive).toBeTruthy();
    })

    it('Should return isActive: false if subscription is not active', async () => {
        subscriptionsToReturn = [
            {
                ended_at: 123
            }
        ]

        const status = await getSubscriptionStatus();

        expect(status.isActive).toBeFalsy();
    });

    it('Should return isCancelled: true if subscription is cancelled', async () => {
        subscriptionsToReturn = [
            {
                canceled_at: 123
            }
        ]

        const status = await getSubscriptionStatus();

        expect(status.isCancelled).toBeTruthy();
    })

    it('Should return isCancelled: false if subscription is not cancelled', async () => {
        subscriptionsToReturn = [
            {}
        ]

        const status = await getSubscriptionStatus();

        expect(status.isCancelled).toBeFalsy();
    });

    it('Should return daysLeft: 0 if there are not subscriptions', async () => {
        subscriptionsToReturn = [];

        const status = await getSubscriptionStatus();

        expect(status.daysLeft).toStrictEqual(0);
    });

    it('Should return daysLeft: 0 if there are no subscriptions or if subscription is cancelled', async () => {
        subscriptionsToReturn = [];

        const status = await getSubscriptionStatus();

        expect(status.daysLeft).toStrictEqual(0);

        subscriptionsToReturn = [{
            canceled_at: moment().subtract(1, 'days').unix()
        }]

        expect(status.daysLeft).toStrictEqual(0);
    })

    it('Should return daysLeft: x where x is number of days left before subscription gets cancelled (if it has been cancelled)', () => {

    });
});