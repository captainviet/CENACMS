if (Meteor.isClient) {


	var queryGenerator = function(str) {
		var ret = '';
		for (var i = 0; i < str.length; i++) {
			if (str[i] == ' ') {
				ret += '+';
			} else {
				ret += str[i];
			}
		}
		return ret;
	};

	Meteor.startup(function() {	
		GoogleMaps.load();
	});

	GoogleMaps.ready('map', function(map) {
		var locationList = Incidents.find().fetch();
		for (var i = 0; i < locationList.length; i++) {
			var curLocation = locationList[i].location;
			var path = 'https://maps.googleapis.com/maps/api/geocode/json?address=' 
						+ queryGenerator(curLocation) 
						+ '&components=country:SG';
			$.getJSON(path, function(data) {
				var location = data.results[0].geometry.location; // first result
				var marker = new google.maps.Marker({
					position: location,
					map: map.instance,
					icon: '/img/flag.png'
				});
				marker.addListener('click', function() {
					map.instance.setZoom(15);
					map.instance.setCenter(marker.getPosition());
				});
			});
		}
	});

	Template.map.helpers({	
		mapOptions: function() {
			if (GoogleMaps.loaded()) {
				return {
					center: new google.maps.LatLng(1.3557212, 103.8211139), // Singapore's position
					zoom: 11
				};
			}
		}
	});

}