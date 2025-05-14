import { getStripeCustomerID } from './stripe';

let supabaseError = false;
let supabaseNoUser = false;

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


describe('getStripeCustomerID()', () => {

    beforeEach(() => {
        supabaseError = false;
        supabaseNoUser = false;
    })

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