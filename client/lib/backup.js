/* Created by Vince Dang */

if (Meteor.isClient) {

	Meteor.subscribe('backups');

	Session.set('add-agency', false);
	/* Session boolean variable used to select display content */

	Template.backup.helpers({
		addButtonPressed: function () {
			return Session.get('add-agency');
		},
		agencies: function() {
			return Backups.find({option: {$not: "0"}});
		}
	})
	/* Return the add-agency session variable to the client .html*/

	Template.backup.events({
		'click #send': function (event) {
			event.preventDefault();
			var option = $('#agency').val();
			var text = $('#text').val();
			$('#agency').prop('selectedIndex', 0);
			$('#text').val("");

			Meteor.call('sendMessage', option, text);	// Ask server to send a message to the agency (option) with content text
		},
		'click #add-agency': function (event) {
			event.preventDefault();
			Session.set('add-agency', true);
		},
		/* If the user wants to add new agency, change the view to Add Agency view */
		'click #add': function (event) {
			event.preventDefault();
			var agencyName = $('#agency-name').val();
			var agencyNumber = $('#agency-number').val();

			if ((agencyNumber.length != 8 || (agencyNumber.charAt(0) != 8 && agencyNumber.charAt(0) != 9)) && (agencyNumber.length != 11 || agencyNumber.substring(0, 3) != '+65'))
				alert('Invalid Singapore number!');
			/* Reject insertion request if the number is not a valid Singaporean number (international) */
			else {
				if (agencyNumber.charAt(0) != '+') {
					agencyNumber = '+65' + agencyNumber;
					/* Add country code to the number if it's in local form */
				}
				var lastOption = Number(Backups.findOne().option) + 1;
				$('select').append($('<option></option>').val(lastOption).text(agencyName));
				Meteor.call('addAgency', lastOption, agencyName, agencyNumber);
				/* Add a new agency and update the phone number database (backup) */
			}

			$('#agency-name').val("");
			$('#agency-number').val("");
			Session.set('add-agency', false);
			/* Change the view back to Send Request view */
		}
	});

}