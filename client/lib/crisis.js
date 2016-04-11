if (Meteor.isClient) {

	Session.set('request-sent', false);
	/* Session boolean variable userd to select display content */

	Template.crisis.helpers({
		requestSent: function () {
			return Session.get('request-sent');
		},
		workMode: function () {
			if (Session.get('isCrisis')) {
				return 'Deactivate';
			} else {
				return 'Activate';
			}
		},
		actionMode: function () {
			if (Session.get('isCrisis')) {
				return 'De-Panic';
			} else {
				return 'Panic!';
			}
		}
	})
	/* Return the request-sent session variable to the client .html */

	Template.crisis.events({
		'click #send-code': function (event) {
			event.preventDefault();
			Meteor.call('sendCode');	// Request the server to send an activation code
			alert('Activation code sent to administrator!');
			Session.set('request-sent', true);	// After requesting for code
		},										// return to the code input view
		'click #panic': function (event) {
			event.preventDefault();
			var inputCode = $('#act-code').val();
			$('#act-code').val("")
			Meteor.call('switchPanicMode', inputCode, function(err, result) {
				if (err) {
					throw new Meteor.Error(err);
				} else {
					if (result != Session.get('isCrisis')) {
						alert("Panic Mode switched successfully!");
					} else {
						alert("Wrong Activation Code!");
					}
					Session.set('isCrisis', result);
					Session.set('request-sent', false);
				}
			});	// Request the server to authenticate the code
		},												 
		'click #re-send': function (event) {
			event.preventDefault();
			Meteor.call('sendCode');	// Request the server to re-send
			alert('Activation code sent to administrator!');
		}								// the activation code in case of
	})									// expiration
}