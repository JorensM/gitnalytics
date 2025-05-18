/**
 * @jest-environment node
 */

import stripeConfig from '@/__tests__/__mocks__/stripeConfig';
import { POST } from './route'
import { NextRequest } from 'next/server';

describe('/webhooks/account-deleted POST', () => {
    it('Should delete stripe user', async () => {

        stripeConfig.customers = [{
            id: 'to_delete'
        }];

        const res = await POST(new NextRequest('https://gitnalytics.com/api/webhooks/account-deleted', {
            method: 'POST',
            body: JSON.stringify({
                old_record: {
                    raw_user_metadata: {
                        stripe_customer_id: 'to_delete'
                    }
                }
            })
        }));

        expect(stripeConfig.customers).toHaveLength(0);
        expect(res.status).toBe(200);
    })
})