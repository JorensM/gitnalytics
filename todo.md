
* Check prod integrations and verify that everything works correctly
    * ~~Bug: Can not sign in to google because APP_URL env var points to wrong URL (might be fixed already)~~
    * Stripe production
        * Webhooks
        * Redirect to correct domain (after checkout)
* Add required Stripe details to website https://support.stripe.com/questions/business-website-for-account-activation-faq
* Report does not include last date
* Add loading indicator for platform logout buttons
* Brainstorm possible integrations (BitBucket, GitLab, Analytics Platforms)
* Figure out an interface for communication between integrations


Unplanned:

* Change plan logic - webhook to react to plan change

Done:

* ~~Add a 'Contact us' button~~
* ~~Buy domain~~
* ~~Set up Google Analytics for Gitnalytics~~
* ~~Allow user to sign out of GitHub without needing to go to their GH settings page~~
* ~~Subscription renews on _date_ (in settings)~~
* ~~When user is unsubscribed but still have paid days left, show a warning with
how many days they have left until losing access~~
* ~~Bug: When the commit descriptions overflow the chart <canvas/> element, the parts that overflow are hidden~~
* ~~Metric selection - display statistics for selected metric (new users, active users, events)~~
* ~~Landing page~~
* ~~Include organization repos in repo dropdown~~
* ~~Repo selection instead of name input - more intuitive to let the user select the repo from a dropdown~~
* ~~Renew subscription feature~~
* ~~Change password feature~~
* ~~Add register link to login page~~
* ~~Unsubscribe logic - webhook to react to unsubscription - set an 'unsubscribed' flag in Supabase user metadata,
 and block user from using the app while not subscribed~~