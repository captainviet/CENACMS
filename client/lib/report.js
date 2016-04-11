if (Meteor.isClient) {

	var getBtnState = function(type) {
		return Session.get('activeReportType') == type ? 'btn-primary' : 'btn-default';
	}

	Meteor.subscribe('incidents');

	Template.report.onRendered(function() {
		Session.set('activeReportType', 'table');
		// if (Session.get('reportIncidents').length != Incidents.find().fetch().length) {
		// 	location.reload();
		// }
	});

	Template.report.helpers({
		reportIncidents: function() {
			var pool = Session.get('reportIncidents');
			console.log(pool);
			for (var i = 0; i < pool.length; i++) {
				pool[i].timestamp = String(pool[i].timestamp).substring(0,34);
			}
			return pool;
		},
		btnStateTable: function() {
			return getBtnState('table');
		},
		btnStateText: function() {
			return getBtnState('text');
		},
		'tableState': function() {
			return Session.get('activeReportType') == 'table';
		}
	});

	Template.report.events({
		'click .state-btn': function(event) {
			event.preventDefault();
			var selectedState = $("#" + event.target.id);
			var activeState = $('.state-btn.btn-default');
			if (selectedState.hasClass('btn-default')) {
				selectedState.removeClass('btn-default').addClass('btn-primary');
				activeState.removeClass('btn-primary').addClass('btn-default');
				Session.set('activeReportType', event.target.id);
			}
		},
	});

}