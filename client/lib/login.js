/* Created by Vince Dang */

if (Meteor.isClient) {

	Template.login.helpers({
		err: function() {
			return Session.get('loginError');
		}
	});

	Template.login.events({
		'click #login-btn': function() {
			event.preventDefault();
			var username = $('#username').val();
			var password = $('#password').val();
			console.log(username + ' ' + password);
			console.log(Meteor.users.find().fetch());
			Meteor.loginWithPassword(username, password, function(err) {
				if (err) {
					console.log(err);
					Session.set('loginError', err.reason);
					throw new Meteor.Error(err);
				} else {
					Router.go('/new-incident');
				}
			});
		}

	})
}

