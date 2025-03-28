* Change password feature
* Measurement selection - display statistics for selected measurement (new users, active users, events)
* Add register link to login page
* Repo selection instead of name input - more intuitive to let the user select the repo from a dropdown
* Renew subscription feature

Unplanned:

* Change plan logic - webhook to react to plan change

Done:

* Unsubscribe logic - webhook to react to unsubscription - set an 'unsubscribed' flag in Supabase user metadata,
 and block user from using the app while not subscribed