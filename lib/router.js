Router.route('/', {
	template: 'public'
});

Router.route('/login');
Router.route('/backup');
Router.route('/crisis');
Router.route('/admin');
Router.route('/user-admin', {
	data: function() {
		var users = Meteor.users.find().fetch();
		return users;
	},
	onBeforeAction: function() {
		var proceed = this.next;
		Meteor.call('isAdmin', function(err, result) {
			if (err) {
				console.log(err);
				throw new Meteor.Error(err);
			} else {
				if (result) {
					proceed();
				} else {
					Router.go('/admin');
				}
			}
			// isAdmin = result;
		});
	},
	onRerun: function() {
		this.next();
	}
}, {where: 'server'});
Router.route('/new-incident');
Router.route('/social');
Router.route('/map');
Router.route('/report', {
	data: function() {
		var incidents = Incidents.find().fetch();
		return incidents;
	}
}, {where: 'server'});

Router.configure({
	layoutTemplate: 'master'
});

var redirectFunction = function () {
	// all properties available in the route function
	// are also available here such as this.params
	if (!Meteor.userId()) {
		Router.go('/login');
	} else {
		// otherwise don't hold up the rest of hooks or our route/action function
		// from running
		this.next();
	}
};

Router.onBeforeAction(redirectFunction, {
	only: ['new-incident', 'backup', 'crisis', 'social', 'report']
});