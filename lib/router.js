Router.route('/', {
	template: 'public'
});

Router.route('/login');
Router.route('/backup');
Router.route('/crisis');
Router.route('/new-incident');
Router.route('/social');
Router.route('/map');

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
	only: ['new-incident', 'backup', 'crisis', 'social']
});