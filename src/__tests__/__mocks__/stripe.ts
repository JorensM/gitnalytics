// import './common';
import '@/util/createStripeClient';
import stripeConfig from './stripeConfig';

export default class Stripe {

    subscriptions;
    customers;

    constructor(secretKey: string) {
        this.subscriptions = {
            list: async (params: { customer: string }) => {
                    if(params.customer === 'stripe_customer_id') {
                        return { data: stripeConfig.subscriptionsToReturn }
                    } else {
                        throw new Error("No such customer: '" + params.customer + "'")
                    }
            }
        }

        this.customers = {
            del: async (id: string) => {
                const index = stripeConfig.customers.findIndex(customer => customer.id === id);
                if(index < 0) {
                    return {
                        lastResponse: {
                            statusCode: 500
                        }
                    }
                } else {
                    stripeConfig.customers.splice(index, 1);
                    return {
                        lastResponse: {
                            statusCode: 200
                        }
                    }
                }
            }
        }
    }
}

jest.mock('stripe');

beforeEach(() => {
    stripeConfig.subscriptionsToReturn = [];
})

