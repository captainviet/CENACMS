/* Created by Vince Dang */

if (Meteor.isClient) {


	var autoUserLogout = setInterval(function () {
			// Meteor.users.remove({username: null});
			Meteor.logout();
			console.log('Session expired! User auto-logged out!');
		}, 900000);
	/* Set auto logged-out every 10 minutes */

	Template.login.onRendered(function() {
		Accounts.createUser({
			username: 'huynhduc',
			password: '123123'
		});
	});

	Template.login.helpers({
		err: function() {
			return Session.get('loginError');
		}
	});
	/* Return error message to HTML */

	Template.login.events({
		'click #login-btn': function(event) {
			event.preventDefault();
			var username = $('#username').val();
			var password = $('#password').val();
			console.log(username + ' ' + password);
			Meteor.loginWithPassword(username, password, function(err) {
				/* Log the user in using Meteor package accounts-password built-in method */
				if (err) {
					console.log(err);
					Session.set('loginError', err.reason);
					throw new Meteor.Error(err);	// Throw handler if error occurs
				} else {
					Router.go('/new-incident');	// Navigate to New Incident page
				}
			});
		}

	})
}

