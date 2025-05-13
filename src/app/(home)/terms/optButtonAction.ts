import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const handleOptButtonClick = async () => {
        'use server';
        const _cookies = await cookies();
        const optedIn = _cookies.get('data-consent');
        if(optedIn) {
            _cookies.delete('data-consent');
        } else {
            _cookies.set('data-consent', 'true');
        }
        revalidatePath('/terms', 'layout');
        redirect('/terms?optedOut=' + !optedIn);
}