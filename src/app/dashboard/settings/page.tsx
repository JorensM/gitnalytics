import ManageSubscriptionButton from '@/components/buttons/ManageSubscriptionButton';
import RenewSubscriptionButton from '@/components/buttons/RenewSubscriptionButton';
import Link from 'next/link';
import APIDeleteAccount from './APIdeleteAccount';
import { createClient } from '@/util/supabase/server';
import DeleteAccountButton from './DeleteButton';

export default function SettingsPage() {

    const deleteAccount = async (formData: FormData) => {
        'use server';
        console.log('formdata: ', formData.get('email'));
        await APIDeleteAccount(formData.get('email') as string);
    }

    return (
        <div className='flex flex-col gap-4 settings'>
            <section>
                <h2>Billing</h2>
                <ManageSubscriptionButton/>
                {/* <RenewSubscriptionButton/> */}
            </section>
            <section>
                <h2>Account</h2>
                <Link href='/dashboard/settings/change-password'>Change Password</Link>
                <form
                    action={deleteAccount}
                    // id='delete-account-form'
                >
                    <DeleteAccountButton form='delete-account-form'/>
                </form>
            </section>
        </div>
    )
}