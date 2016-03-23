if (Meteor.isClient) {

	Template.newIncident.events({
		'click #send': function(event) {
			event.preventDefault();
			var type = $('#type').val();
			var location = $('#location').val();
			var resource = $('#resource').val();
			var quantity = $('#quantity').val();
			var details = $('#details').val();
			Incidents.insert({
				type: type,
				location: location,
				resourceRequested: {
					name: resource,
					quantity: quantity
				},
				details: details,
				timestamp: new Date()
			}, function(err) {
				if (err) {
					throw new Meteor.Error(err);
				} else {
					$('#type').prop('selectedIndex',0);
					$('#location').val('');
					$('#resource').prop('selectedIndex',0);
					$('#quantity').val(0);
					$('#details').val('');

					$('.glyphicon-ok').removeClass('hidden');
				}
			});
		},
		'click #cancel': function(event) {
			event.preventDefault();
			history.go(-1);
		}
	});

}