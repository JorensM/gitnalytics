import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const handleOptButtonClick = async () => {
        'use server';
        const _cookies = await cookies();
        const prevOptedOut = _cookies.get('disable-stats')?.value === 'true';
        if(prevOptedOut) {
            console.log('opting in');
            _cookies.delete('disable-stats');
        } else {
            console.log('opting out')
            _cookies.set('disable-stats', 'true');
        }
        revalidatePath('/terms', 'layout');
        redirect('/terms?' + (!prevOptedOut ? ('optedOut=true') : ''));
}