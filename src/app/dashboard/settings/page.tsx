import ManageSubscriptionButton from '@/components/buttons/ManageSubscriptionButton';
import Link from 'next/link';

export default function SettingsPage() {
    return (
        <div className='flex flex-col gap-4'>
            <ManageSubscriptionButton/>
            <Link href='/register'>Reset Password</Link>
        </div>
    )
}