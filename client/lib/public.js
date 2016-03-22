if (Meteor.isClient) {

	Meteor.startup(function() {	
		GoogleMaps.load();
	});

	Template.public.helpers({	
		mapOptions: function() {
			if (GoogleMaps.loaded()) {
				return {
					center: new google.maps.LatLng(1.3557212, 103.8211139),
					zoom: 11
				};
			}
		}
	});

}