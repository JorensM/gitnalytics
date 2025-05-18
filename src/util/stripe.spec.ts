import moment from 'moment';
import { getStripeCustomerID, getSubscriptionActive, getSubscriptionCancelled, getSubscriptionStatus, getSubscriptionStatusMessage } from './stripe';
import supabaseConfig from '@/__tests__/__mocks__/supabase';

beforeEach(() => {
    supabaseConfig.supabaseError = false;
    supabaseConfig.supabaseNoUser = false;
    supabaseConfig.subscriptionsToReturn = [];
})

describe('getStripeCustomerID()', () => {

    it('Should return the Stripe customer ID of the current customer', async () => {
        const customerID = await getStripeCustomerID();
        expect(customerID).toEqual('stripe_customer_id');
    })

    it('Should throw error if no user is logged in', async () => {
        supabaseConfig.supabaseNoUser = true;
        expect(getStripeCustomerID).rejects.toEqual('No user found');
    })

    it('Should throw error if supabase client returned error', async () => {
        supabaseConfig.supabaseError = true;
        expect(getStripeCustomerID).rejects.toContain('Supabase error:');
    })
});

describe('getSubscriptionActive()', () => {
    it('Should return false if there are no active subscriptions', async () => {
        let active = await getSubscriptionActive();
        expect(active).toBeFalsy();

        supabaseConfig.subscriptionsToReturn = [
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
        supabaseConfig.subscriptionsToReturn = [
            {},
            {
                ended_at: 123
            }
        ];

        let active = await getSubscriptionActive();
        expect(active).toBeTruthy();

        supabaseConfig.subscriptionsToReturn = [
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

        supabaseConfig.subscriptionsToReturn = [
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
        supabaseConfig.subscriptionsToReturn = [
            {
                canceled_at: 123
            },
            {}
        ];

        let active = await getSubscriptionCancelled();
        expect(active).toBeFalsy();

        supabaseConfig.subscriptionsToReturn = [
            {}
        ];

        active = await getSubscriptionCancelled();
        expect(active).toBeFalsy();
    })
})

describe('getSubscriptionStatus()', () => {
    it('Should return isActive: true if subscription is active', async () => {

        supabaseConfig.subscriptionsToReturn = [
            {}
        ]

        const status = await getSubscriptionStatus();

        expect(status.isActive).toBeTruthy();
    })

    it('Should return isActive: false if subscription is not active', async () => {
        supabaseConfig.subscriptionsToReturn = [
            {
                ended_at: 123
            }
        ]

        const status = await getSubscriptionStatus();

        expect(status.isActive).toBeFalsy();
    });

    it('Should return isCancelled: true if subscription is cancelled', async () => {
        supabaseConfig.subscriptionsToReturn = [
            {
                canceled_at: 123
            }
        ]

        const status = await getSubscriptionStatus();

        expect(status.isCancelled).toBeTruthy();
    })

    it('Should return isCancelled: false if subscription is not cancelled', async () => {
        supabaseConfig.subscriptionsToReturn = [
            {}
        ]

        const status = await getSubscriptionStatus();

        expect(status.isCancelled).toBeFalsy();
    });

    it('Should return daysLeft: 0 if there are no subscriptions', async () => {
        supabaseConfig.subscriptionsToReturn = [];

        const status = await getSubscriptionStatus();

        expect(status.daysLeft).toStrictEqual(0);
    });

    it('Should return daysLeft: 0 if subscription has ended', async () => {
        supabaseConfig.subscriptionsToReturn = [{
            cancel_at: moment().subtract(1, 'days').unix()
        }]

        const status = await getSubscriptionStatus();


        expect(status.daysLeft).toStrictEqual(0);
    })

    it('Should return daysLeft: x where x is number of days left before subscription gets cancelled (if it has been cancelled)', async () => {
        supabaseConfig.subscriptionsToReturn = [
            {
                canceled_at: 123,
                cancel_at: moment().add(8, 'days').unix()
            }
        ]

        const status = await getSubscriptionStatus();

        expect(status.daysLeft).toStrictEqual(7);
    });


    it('Should return nextBillingDate with the next billing date in format YYYY-MM-DD', async () => {
        const billingDate = moment().add(7, 'days');
        supabaseConfig.subscriptionsToReturn = [
            {
                current_period_end: billingDate.unix()
            }
        ];

        const status = await getSubscriptionStatus();

        expect(status.nextBillingDate).toEqual(billingDate.format('YYYY-MM-DD'));
    });
});


describe('getSubscriptionMessage()', () => {
    it("Should return 'Subscription active' if subscription is active", async () => {
        supabaseConfig.subscriptionsToReturn = [{}];

        const message = await getSubscriptionStatusMessage();

        expect(message).toEqual('Subscription active');
    });

    it("Should return 'Subscription ended' if subscription has ended", async () => {
        supabaseConfig.subscriptionsToReturn = [{
            ended_at: 123,
            canceled_at: 123,
            cancel_at: moment().subtract(1, 'day').unix()
        }];

        const message = await getSubscriptionStatusMessage();

        expect(message).toEqual('Subscription ended');
    })

    it("Otherwise should return 'x days until subscription ends' where x is number of days until subscription ends", async () => {

        const billingDate = moment().add(8, 'days');

        supabaseConfig.subscriptionsToReturn = [{
            canceled_at: 123,
            cancel_at: billingDate.unix()
        }]

        const message = await getSubscriptionStatusMessage();

        expect(message).toEqual('7 days until subscription ends');
    })
})