# CENACMS

## What this is
Crisis Emergency Notification Advisory as a Crisis Management System

## What we will be using
### Meteor
A full-stack JavaScript framework where everything from the client side to the server side is done is in JavaScript.
#### Basic things to keep in mind
##### Before you proceed
The following sections assume that you have basic knowledge of HTML, CSS and JavaScript as well as basic CLI (Command Line Interface) commands.

##### Templates
Templates are the equivalent of html files in Meteor, except that is does not require tags like `<html>` or `<body>`. Meteor takes care of these stuff for you.

Example content:
```
<template name="exampleTemplateName">
  <!-- content here -->
</template>
```
Template files has .html extension.
One template file can have many templates declared within, however this is not recommended and should only be used when those templates are strongly connected to each other.

##### Helpers
Helpers are values that can be passed to the templates (aka the views).
Helpers are declared inside .js files.

Helpers' syntax:
```
Template.exampleTemplateName.helpers({
  'exampleHelper': function() {
    // logic here
    return someValueHere;
  },
  'someOtherHelper': function() {
    // more logic here
    return someMoreReturnValueHere;
  }
});
```

How to hook helpers' to the views
```
<template name="exampleTemplateName">
  <p>{{exampleHelper}}</p>
</template>
```

I will explain the `{{exampleHelper}}` part right below.

##### Spacebar logic syntax
Spacebars is a template language that helps you connect the JS logic to the HTML files.

In the previous section, what `{{exampleHelper}}` means is that this code will be replaced by the value of the `exampleHelper` helper as found in the JS files.

Not only can you inject helpers, but also do a variety of things like:

_iteration_
```
<template name="exampleTemplateName">
  <div>
    {{#each ar}} // for each element in array "ar" (ar should be declared in a JS file somewhere already)
      <p>{{attr}}</p> // insert "<p>" + the value of the attribute "attr" of the current array element + "</p>"
    {{/each}} // end of "each" statement
  </div>
</template>
```

_branching_
```
<template name="exampleTemplateName">
  <div>
    {{#if thisCondition}} // if "thisCondition" is true
      <!-- some code -->
    {{else}} // otherwise
      <!-- some other code -->
    {{/if}} // end of "if" statement
  </div>
</template>
```

See the documentation for more details. (link below)

##### Events
Events helps you declare things that happen after the user click/submit/do somwthing on the view.

Say you want to do something when the following button is clicked:
```
<template name="exampleTemplateName">
  <input type="text" placeholder="input text here">
  <button class="submit-button"></button>
</template>
```

Here's what you will add to the equivalent .js file:
```
Template.exampleTemplateName.events({
  'click .submit-button': function(event) {
    event.preventDefault();
    // logic here
  }
});
```

What `event.preventDefault()` is to disable the browser's default behavior of form elements so that you have full control of what they do.

Notice how I wrote `click .submit-button`, which means "When the user clicks on the button with class 'submit-button'". The `click` part is where I declare the interaction, and the `.submit-button` part is where I declare the object that is affected by the interaction. The section syntax is the same thing in jQuery or CSS: `.class-name` for classes, `#id` for ids, etc. If you have no idea how these works and what to use, see the documentation for more details (link below).

##### Collections
Collections are the equivalent of relational databases' relations (tables) in MongoDB.

Syntax for declaring a collection:
```
SampleCollection = new Mongo.Collection('sampleCollection');
```

##### Routers
Routers are logic that provide links between templates and paths.

Say you want to hook the path `/some-template` to the template named `someTemplate`, this is what you can do in the router.js file:
```
Router.route('/some-template');
```

Yep, that's it. The reason it is this simple is because the router automatically recognizes the name `someTemplate` since the path has an equivalent name (`some-template`). If the path name and the template name are different, this is an example of what you have to do:
```
// Hook the home template to the default domain
Router.route('/', {
  name: 'home',
  template: 'home'
});
```

This whole router API thing is provided by a package named `iron:router`. This is not a default package. In order to add this package to a project, use the CLI command to navigate to the project folder and execute `meteor add iron:router`. This has been done by me already so no need to do it again.

##### Sessions
Sessions are global variables that is userd throughout the template.

For example, you want to store the number of cats you have, which is 10, as a global variable. This is how you declare it:
```
Session.set('numOfCats', 10); 
```

Then to get the number of cats back:
```
Session.get('numOfCats');
```

These 2 lines can be put anywhere in the .js file - inside a helper's logic, an event's logic or outside.

##### Normal JavaScript syntax
Basically everything you can do with JavaScript can be done in Meteor.

Say for example, you have a bunch of events that do the same thing. This is what you can do:
```
var doStuff() = function() {
  // code here here
}

Template.exampleTemplateName.events({
  'click .a-button': function(event) {
    event.preventDefault();
    // do things
    doStuff();
  },
  'click .another-button': function(event) {
    event.preventDefault();
    // do other things
    doStuff();
  }
});
```

##### Database interaction
Meteor provides you a local MongoDB database by default, so you don't have to go find a database service somewhere else to do the development. MongoDB is different from relational database in a way that it stores JSONs (JavaScript Object Notation files) instead of rows, columns or relations. It does not use SQL for databse query either, but instead has its own API.

Here are some of the most basic interactions:

_create a collection_ (as mentioned above)
```
Cats = new Mongo.Collection('cats');
```

_insert_
```
Cats.insert({
  name: 'gitty gitty gumdrops',
  age: 2,
  owner: 'me'
});
```

_find one index_
```
Cats.findOne({name: 'gitty gitty gumdrops'}); // returns a JavaScript Object
```

_find all the entries_
```
Cats.find().fetch(); // returns an array of JS Objects
```

_find a specific group of entries that matches a condition_
```
Cats.find({age: 2}).fetch(); // returns an array of cats entries that has the "age" attribute of 2
```

_update_
```
// find the entry with the name "gitty gitty gumdrops" and edit its age to 3
var kitty = Cats.findOne({name: 'gitty gitty gumdrops'});
Cats.update(kitty._id, {$set: {
  age: 3
}});
```

_remove_
```
// delete the entry with the name "gitty gitty gumdrops"
var kitty = Cats.findOne({name: 'gitty gitty gumdrops'});
Cats.remove(kitty._id);
```

Note: In the 2 previous examples I was able to wrote `kitty._id` because whenever you insert an entry into MongoDB, it automatically creates an _id inside that entry for you. Say you execute this command:
```
Cats.insert({
  name: 'gitty gitty gumdrops',
  age: 2,
  owner: 'me'
});
```
This is what will be stored (the value of `_id` is randomized):
```
{
  _id: sv4DWuu38wEykk5Hd,
  name: 'gitty gitty gumdrops',
  age: 2,
  owner: 'me'
}
```

See the documentation for more details. (link below)

##### Bootstrap & jQuery
Bootstrap, or Twitter Bootstrap, is a frontend framework for styling HTML files.

jQuery is a JavaScript framework for better interaction with DOM elements (aka HTML elements) inside the logic.

As the UI has been completed, there should be not much concern about these.

See the documentation should you want more details. (link below)

##### Client vs Server
In order to point out if a bunch of code should be executed on the client side, wrap that into this statement:
```
if (Meteor.isClient) {
  //code here
}
```

The same thing can be done for server code:
```
if (Meteor.isServer) {
  //code here
}
```

Client-ish code include declaration of helpers, templates, jQuery and various other public logic.
Server-ish code include database interaction, user account handling and various other private logic.

_Note: We are currently in the protoyping stage, at which you can still declare server code on the client side for the sake of convienence. We'll fix that later on in stage 2. An exception to this is user account handling code, which is bound to be done on the server side._

##### Basic CLI commands
These are the fundamental things you can do to a project with CLI (all these only work AFTER you have navigated to the project folder):

1. To create a project named "cms" for example: `meteor create cms`
2. To run the application: `meteor`
3. To list all the installed dependencies (or packages): `meteor list`
4. To clear all database entries: `meteor reset`
5. To open MongoDB shell (exclusive MongoDB CLI interface): `meteor mongo` (you can input MongoDB commands here)
6. To update all the dependencies: `meteor update`
7. To add a package, for example the "account-password" package: `meteor add account-password`
8. To remove a package, for example the "account-password" package: `meteor remove account-password`

*Note: For our project, you DO NOT need to execute `meteor create <appname>` first before pulling from the GitHub repo. Just pull to that location, then navigate inside and there, you have the application source code ready.*

##### AtmosphereJS (https://atmospherejs.com/)
Just some extra information.

AtmosphereJS is a hub for tons of open-sourced packages which you can use in your project for free.

Some of the most popular ones are:

1. `twbs:bootstrap`: Twitter Bootstrap - A frontend framework for styling HTML files
2. `iron:router`: Router by Iron - A code library that provide APIs for connecting the templates to the paths.
3. `accounts-password`: User Account and Password - Everything about authentication
4. `fortawesome:fontawesome`: Font Awesome - A library of vector icons that can be used in HTML files

See its official website for more cool stuff. You can google the names of these packages for more information and documentation.

### Heroku & MongoLab
Heroku is a free hosting service that helps you deploy your app in just a few CLI commands.

MongoLab is a MongoDB service provider where you can create sandbox databases and use them for free.

No big concern about these, since we do not need to deploy the app in order to test it. We will only do testing on our own local host as mentioned above. After we have finished the app, however, it is better to deploy it online so as to remove the need of building the app from scratch before presenting.

Doing this is quite easy, but it requires a bit of familiarity. I will take care of this so no worry. I wrote this section just to let you know what's going on behind the scene. Should you want to know how to do it, search online or contact me for details.

## Things to read
The following are the documents that I found essential to understanding what is going on here. Do have a try when you have time.

_Tutorials_

1. Offial Meteor Tutorials (https://www.meteor.com/tutorials/blaze/creating-an-app)
2. Your First Meteor Application (http://meteortips.com/first-meteor-tutorial/) 
3. Your Second Meteor Application (http://meteortips.com/second-meteor-tutorial/)

_Documentions (no need to go through the whole thing, but you'll need them here and there)_

1. Meteor (http://docs.meteor.com/#/full/)
2. MongoDB (https://docs.mongodb.org/manual/reference/)
3. Bootstrap (http://getbootstrap.com/)
4. jQuery (https://api.jquery.com/)
5. Iron Router (http://iron-meteor.github.io/iron-router/)
6. Spacebars (https://github.com/meteor/meteor/blob/devel/packages/spacebars/README.md)
7. CSS Selectors (http://www.w3schools.com/cssref/css_selectors.asp - unofficial, but it looks nicer)

## Work division
### The first stage (done in parallel)
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

### The second stage (done sequentially)
### [Someone]
11. Integrate the work all together

### [Someone]
12. Separate the server login from the client logic, _note_: remove the *insecure* package
13. Ensure proper server publication & client subscription, _note_: remove the *autopublish* package

### [Someone]
14. Final styling & proofing of pages

### Duc
15. Deploy the application
