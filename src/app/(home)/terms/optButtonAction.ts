import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const handleOptButtonClick = async () => {
        'use server';
        const _cookies = await cookies();
        const prevOptedIn = _cookies.get('data-consent')?.value === 'true';
        if(prevOptedIn) {
            console.log('opting out')
            _cookies.delete('data-consent');
        } else {
            console.log('opting in');
            _cookies.set('data-consent', 'true');
        }
        revalidatePath('/terms', 'layout');
        redirect('/terms?' + (prevOptedIn ? ('optedOut=true') : ''));
}