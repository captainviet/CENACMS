/* Created by Vince Dang */

if (Meteor.isClient) {

	var autoAdminLogout = setInterval(function () {
			// Meteor.users.remove({username: null});
			Meteor.call('logoutAdmin');
			Meteor.logout();
			console.log('Session expired! Admin auto-logged out!');
		}, 900000);
	/* Set auto logged-out every 10 minutes */


	Template.admin.helpers({
		err: function() {
			return Session.get('loginError');
			/* Return error message to HTML */
		},
	})

	Template.admin.events({
		'click #login-btn': function(event) {
			event.preventDefault();
			var username = $('#username').val();
			var password = $('#password').val();
			console.log(username + " " + password);
			/* Authenticate administrator with given credentials */
			Meteor.call('authenticateAdmin', username, password, function(err, result) {
				if (err) {
					console.log(err);
					Session.set('loginError', err.reason);
					throw new Meteor.Error(err);	// Throw handler if error occurs
				}
				else if (result) {	// if an admin has logged in
					Meteor.loginWithPassword(username, password, function(err) {
						if (err) {	// log him in as an operator as well
							console.log(err);
							throw new Meteor.Error(err);
						}
					});
					Router.go('/user-admin');
					/* Navigate to the Operator Management page */
				}
			});
		},
	})
}