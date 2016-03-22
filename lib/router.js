Router.route('/', {
	name: 'login',
	template: 'login'
});

Router.route('/public');
Router.route('/crisis');
Router.route('/new-incident');
Router.route('/backup');
Router.route('/social');
Router.route('/map');

Router.configure({
	layoutTemplate: 'master'
});