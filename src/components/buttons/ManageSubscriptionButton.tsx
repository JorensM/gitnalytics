'use client';

export default function ManageSubscriptionButton() {
    return (
        <form action="/api/auth/manage-subscription" method="GET">
            <button className='link' id="checkout-and-portal-button" type="submit">
                Manage your subscription
            </button>
        </form>
    )
}