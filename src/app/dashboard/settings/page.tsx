import ManageSubscriptionButton from '@/components/buttons/ManageSubscriptionButton';
import RenewSubscriptionButton from '@/components/buttons/RenewSubscriptionButton';
import Link from 'next/link';

export default function SettingsPage() {
    return (
        <div className='flex flex-col gap-4 settings'>
            <section>
                <h2>Billing</h2>
                <ManageSubscriptionButton/>
                <RenewSubscriptionButton/>
            </section>
            <section>
                <h2>Account</h2>
                <Link href='/dashboard/settings/change-password'>Change Password</Link>
            </section>
        </div>
    )
}