import { APP_URL } from '@/constants/envVars';
import Auth from '@/util/classes/Auth';
import { createClient } from '@/util/supabase/server';

// type APIResponseBase

type APIResponseBase<T> = {
    data?: T,
    status: number,
    errorMessage?: string
}

type SuccessAPIResponse<T> = APIResponseBase<T> & {
    data: T,
    status: 200,
    errorMessage: undefined
}

type ErrorAPIResponse = APIResponseBase<undefined> & {
    data?: undefined,
    status: 500 | 400,
    errorMessage: string
}

type APIResponse<T> = SuccessAPIResponse<T> | ErrorAPIResponse

/**
 * Send API request to delete current user's account
 * @param userEmail 
 * 
 * @returns { boolean } true if successfully deleted account, false otherwise
 */
export default async function APIDeleteAccount(userEmail: string): Promise<APIResponse<undefined>> {
    // Check if email is correct and return error if not
    const supabase = await createClient();
    const auth = new Auth(supabase);
    const user = await auth.getCurrentUser();

    console.log(userEmail, ' - ', user?.email);

    if(user?.email === userEmail) {
        console.log('making request');
        const res = await fetch(APP_URL + '/api/auth/account', {
            method: 'DELETE'
        });

        const data = await res.json();

        return {
            ...data,
            status: res.status
        }
    } else {
        return {
            data: undefined,
            status: 400,
            errorMessage: 'Incorrect email'
        }
    }
}