* Repo selection instead of name input - more intuitive to let the user select the repo from a dropdown
* Measurement selection - display statistics for selected measurement (new users, active users, events)
* Renew subscription feature
* When user is unsubscribed but still have paid days left, show a warning with
how many days they have left until losing access

Unplanned:

* Change plan logic - webhook to react to plan change

Done:

* Change password feature
* Add register link to login page
* Unsubscribe logic - webhook to react to unsubscription - set an 'unsubscribed' flag in Supabase user metadata,
 and block user from using the app while not subscribed