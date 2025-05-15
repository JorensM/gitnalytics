import { cookies } from 'next/headers'
import { handleOptButtonClick } from './optButtonAction';
import OptOutAlert from './OptOutAlert';



export default async function TermsPage() {

    const _cookies = await cookies();

    const optedOut = _cookies.get('disable-stats')?.value === 'true';

    return (
        <div className='p-8 max-w-[800px] flex flex-col gap-2'>
            <OptOutAlert />
            <h2 className='text-xl font-bold'>Privacy Policy</h2>
            <h3 className='text-lg font-semibold'>User data</h3>
            <p>
                Upon registration, the following user data will be securely stored
                in our database: email address, Stripe client ID.
                <br/>
                Your (full or partial) payment information will be stored with Stripe, which can
                be accessed by us.
            </p>
            <h3 className='text-lg font-semibold'>User activity and statistics data</h3>
            <p>
                By default, this platform collects some anonymous data using Google Analytics, namely:
            </p>
            <ul className='pl-2'>
                    <li>Page visits</li>
                    <li>Non-specific page events (clicks, scrolls, page navigation)</li>
                    <li>Referring website</li>
                </ul>
            <p>
                {optedOut ? 'You are currently opted out of data collection.' : ''}
                If you wish to {!optedOut ? 'opt out' : 'opt in'}, click the link below:
            </p>
            <form
                action={handleOptButtonClick}
            >
                <button
                    className='text-blue-400 border-none w-fit py-0 px-0 hover:bg-transparent hover:underline'
                >
                    {!optedOut ? 'Opt out': 'Opt in'}
                </button>
            </form>
        </div>
    )
}