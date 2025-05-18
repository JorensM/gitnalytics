
PH milestone tasks:

* ~~Begin TDD~~
* ~~Use repository events endpoint and 'PushEvent' objects to get dates for when~~
~~commits were pushed instead of when they were made on developer's local env 1h~~ actual: 26m
* ~~Prevent registration if account already exists 1h~~ actual: 1.5h
* Handle error when customer is not found 1h
* Delete account and data feature 1h
    * Cancel Stripe subscription when user gets deleted 
    (listen for delete webhook so that accounts can be properly deleted from Supabase dashboard)
* Add required Stripe details to website https://support.stripe.com/questions/business-website-for-account-activation-faq
* Audit site for compliance (GDPR, PCI) 1h
* Pricing page 1h
* Add logo
* About page with attribution for logo:
    * Logo by <a href="https://www.vecteezy.com/members/ykadesign">Yazid Kun</a>

1h:
* Left nav is wrong height after generating report
* Add loading indicator for platform logout buttons
* Hide "Next billing date on" when subscription has been cancelled
* Missing space on Register page on the demo paragraph
* Make page titles unique for analytics

* Check website for errors 1h + 0-4h of fixing
* Unit tests - remaining time till launch

Total estimate: 8h-12h

PH launch planned for June 1st

Tasks:

* use GH issues for tasks

Unplanned:

* Figure out an interface for communication between integrations
* Brainstorm possible integrations (BitBucket, GitLab, Analytics Platforms)
* Change plan logic - webhook to react to plan change

Done:

* ~~Check prod integrations and verify that everything works correctly~~
    * ~~Bug: Can not sign in to google because APP_URL env var points to wrong URL (might be fixed already)~~
    * ~~Stripe production~~
        * ~~Webhooks~~
        * ~~Redirect to correct domain (after checkout)~~
* ~~Report does not include last date~~
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