if (Meteor.isClient) {

	Meteor.subscribe('backups');

	Session.set('add-agency', false)

	Template.backup.helpers({
		addButtonPressed: function () {
			return Session.get('add-agency');
		}
	})

	Template.backup.events({
		'click #send': function (event) {
			event.preventDefault();
			var option = $('#agency').val();
			var text = $('#text').val();
			$('#agency').prop('selectedIndex', 0);
			$('#text').val("");
			Meteor.call('sendMessage', option, text);
			// Meteor.call('something');
			var no = Session.get('phone-no');
			console.log(no);
		},
		'click #add-agency': function (event) {
			event.preventDefault();
			Session.set('add-agency', true);
		},
		'click #add': function (event) {
			event.preventDefault();
			var agencyName = $('#agency-name').val();
			var agencyNumber = $('#agency-number').val();
			if (agencyNumber)
			var lastOption = Backups.findOne().option;
			var createOption = function (lastOption, agencyName) {
				var string = '<option value="' + (lastOption + 1) + '">' + agencyName + '</option>';
				return string;
			}
			$('#agency').append(createOption(lastOption, agencyName));
			Meteor.call('addAgency', lastOption, agencyNumber);
			$('#agency-name').val("");
			$('#agency-number').val("");
			Session.set('add-agency', false);
		}
	});

}