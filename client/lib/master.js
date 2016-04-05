if (Meteor.isClient) {

	Template.master.onRendered(function() {
		var routeName = Router.current().route.getName();
		$('#' + routeName).css('font-weight', 'bold');
	});

	Template.master.events({
		'click .nav-btn': function(event) {
			var targetId = event.target.id;
			$('.nav-btn').css('font-weight', 'normal');
			$('#' + targetId).css('font-weight', 'bold');
		},
		'click #logout': function() {
			Meteor.logout();
		}
	});

	Template.master.helpers({
		'isCrisis': function() {
			if (!Session.get('isCrisis')) {
				return 'hidden';
			}
		}
	});

}