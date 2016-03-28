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
			if (agencyNumber.charAt(0) === '8' || agencyNumber.charAt(0) === '9')
				agencyNumber = '+65' + agencyNumber;
			var lastOption = Backups.findOne().option;
			var createOption = function (lastOption, agencyName) {
				var string = '<option value="' + (Number(lastOption) + 1) + '">' + agencyName + '</option>';
				console.log(string);
				return string;
			}
			$('#agency').append(createOption(lastOption, agencyName));
			Meteor.call('addAgency', Number(lastOption) + 1, agencyNumber);
			$('#agency-name').val("");
			$('#agency-number').val("");
			Session.set('add-agency', false);
		}
	});

}