GA > Data Reports > Dashboard
GitHub > Commit History > Dashboard
Calculate values and generate chart for given time period

Need: 
 * Google Cloud Console
 * Google Auth
 * Fetch and display properties; select property
 * GitHub Auth
 * Fetch and display repos; select repo.
 * Fetch Commit History
 * Fetch GA Report 
 * Convert Commit history to GA supported format
 * Display data in a chart
 * Change Display Name

After deploy:
 * Google Cloud Console OAuth Client Credential URIs 

Later:
 * Payment/Subscriptions

Env vars:

SUPABASE_URL
SUPABASE_API_KEY
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET
APP_URL
STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY
STRIPE_SUBSCRIPTION_LOOKUP_KEY
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY

Stripe config:

Need to create a product for subscription,
need to configure customer portal at https://dashboard.stripe.com/test/settings/billing/portal
