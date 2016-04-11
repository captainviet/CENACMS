if (Meteor.isClient) {

	Session.set('request-sent', false);
	/* Session boolean variable userd to select display content */

	Template.crisis.helpers({
		requestSent: function () {
			return Session.get('request-sent');
		}
	})
	/* Return the request-sent session variable to the client .html */

	Template.crisis.events({
		'click #send-code': function (event) {
			event.preventDefault();
			Meteor.call('sendCode');	// Request the server to send an activation code
			Session.set('request-sent', true);	// After requesting for code
		},										// return to the code input view
		'click #panic': function (event) {
			event.preventDefault();
			var inputCode = $('#act-code').val();
			$('#act-code').val("")
			Meteor.call('authenticateCode', inputCode, function(err, result) {
				if (err) {
					throw new Meteor.Error(err);
				} else {
					Session.set('isCrisis', result);
				}
			});	// Request the server to authenticate the code
		},												 
		'click #re-send': function (event) {
			event.preventDefault();
			Meteor.call('sendCode');	// Request the server to re-send
		}								// the activation code in case of
	})									// expiration
}