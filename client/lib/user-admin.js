/* Created by Vince Dang */

if (Meteor.isClient) {

	Meteor.subscribe('users');
	Session.set('showUser', true);

	Template.userAdmin.onRendered(function() {
		this.autorun(function() {
			Template.currentData();
			Session.set('error', null);
		})
	});

	Template.userAdmin.helpers({
		err: function() {
			return Session.get('error');
		},
		/* Return error message to HTML */
		users: function() {
			return Meteor.users.find();
		},
		/* Return list of operator to be displayed by HTML */
		showUser: function() {
			return Session.get('showUser');
		}
		/* Flag to switch between Show List view and Add Operator view */
	});

	Template.userAdmin.events({
		'click #add-operator': function(event) {
			event.preventDefault(event);
			Session.set('showUser', false);
		},
		/* Switch to Add Operator view */
		'click #logout': function(event) {
			event.preventDefault(event);
			Meteor.call('logoutAdmin');
			Meteor.logout();
			Router.go('/admin');
		},
		/* Log the admin out and (implicitly) return to Admin Login page */
		'click #add-user': function(event) {
			event.preventDefault(event);
			var username = $('#new-username').val();
			var password = $('#new-password').val();
			var password_re = $('#new-password-re').val();
			console.log(username + ' ' + password + ' ' + password_re);
			if (password != password_re) {	// Prevent user from entering wrong password
				Session.set('error', 'Password not match!');
			} else {
				Meteor.call('createOperator', username, password, function(err) {
					if (err) {	// Create a new operator with the username and password entered
						console.log(err);
						Session.set('error', err.reason);
						throw new Meteor.Error(err);
					}
				});
				Session.set('showUser', true);
				/* Return to Show List view after successful insertion */
			}
		},

	});

	Template.user.helpers({
		isAdmin: function() {
			Meteor.call('isAdmin', function(err, result) {
				return result;
			})
		},
		/* Show if an operator in the list is an admin or not */
	});

	Template.user.events({
		'click #delete': function(event) {
			event.preventDefault(event);
			if (confirm("Confirm delete user from List of Operators?"
				+ "\n" + "NOTE: Action cannot be reversed!")) {
				console.log(this._id);
				Meteor.call('removeOperator', this._id, function (err, result) {
					if (err) {
						console.log(err);
						throw new Meteor.Error(err);
					}
					if (result) {
						alert("Operator removal successful!");
					} else {
						alert("Operator not exists!");
					}
				});
			} else {
				alert("Operator removal aborted!");
			}
		},
		/* Delete an existing operator from list */
		'click #enable-admin': function(event) {
			event.preventDefault(event);

		},
		/* Set an existing operator to be an admin (yet to be done) */
		'click #remove-admin': function(event) {
			event.preventDefault(event);

		},
		/* Remove admin rights of an existing admin --> operator (yet to be done) */
	})
}