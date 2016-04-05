# CENACMS

## What this is
Crisis Emergency Notification Advisory as a Crisis Management System

## Meteor Basics
This section has been moved to a separate repo.

Please do have a look here: https://github.com/itsnhduc/MeteorLEGO

## Work division
#### Vu
1. backup: (request for a backup) add code for inserting backup object into the *backups* collection
2. crisis: (activate panic button) add code for verify panic password, cater for what happens after the button is pressed
3. login: (authentication) add code for login and register, note: use package *accounts-password*

#### Duc
4. map: (operator map) add code for viewing the maps as an operator
5. master: (the master page) add code for displaying the navigation bar
6. new-incident: (create a new incident) add code for inserting incident object into the *incident* collection

#### Quang
7. public: (public map) add code for viewing the maps as a public user
8. social: (share on social network) add code for sharing the current situation on social network, _note_: use packages on atmospherejs.com
9. router: (route definition for navigation) add code for navigating and login status verification for the routes, _note_: see *iron:router* documentation
10. collection: (MongoDB collections) add code for declaring the collections

#### Note: Remember to branch out first and commit to it. *DO NOT COMMIT TO MASTER*
