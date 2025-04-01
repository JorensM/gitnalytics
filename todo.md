* Landing page
* Measurement selection - display statistics for selected measurement (new users, active users, events)
* Bug: When the commit descriptions overflow the chart <canvas/> element, the parts that overflow are hidden
* When user is unsubscribed but still have paid days left, show a warning with
how many days they have left until losing access
* Subscription renews on _date_ (in settings)
* Allow user to sign out of GitHub without needing to go to their GH settings page

Unplanned:

* Change plan logic - webhook to react to plan change

Done:

* Include organization repos in repo dropdown
* Repo selection instead of name input - more intuitive to let the user select the repo from a dropdown
* Renew subscription feature
* Change password feature
* Add register link to login page
* Unsubscribe logic - webhook to react to unsubscription - set an 'unsubscribed' flag in Supabase user metadata,
 and block user from using the app while not subscribed