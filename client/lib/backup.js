if (Meteor.isClient) {

	Meteor.subscribe('backups');

	Template.backup.events({
		'click .send': function (event) {
			event.preventDefault();
			var option = event.target.agency.value,
			text = event.target.text.value;
			event.target.text.value = "";
			Meteor.call('sendMessage', option, text);
		},
		'click .cancel': function (event) {
			
		}
	})

}

if (Meteor.isServer) {

	Meteor.startup(function () {
		process.env.TWILIO_ACCOUNT_SID = 'AC061f3261f802d23a6dd90f35a3eefa71';
		process.env.TWILIO_AUTH_TOKEN = '024296fd85ec53f8e75569944800c343';
		process.env.TWILIO_NUMBER = '+12035806804';
	});

	Backups = new Mongo.Collection('backups');

	Meteor.publish('backups', function () {
		return Backups.find({});
	});

	Meteor.methods({
		sendMessage: function (option, text) {
			var agencyNumber = Backups.findOne({option: option});
			var sendNumber = agencyNum.number;
			HTTP.call("POST", 'https://api.twilio.com/2010-04-01/Accounts/' + process.env.TWILIO_ACCOUNT_SID + '/SMS/Messages.json', {
				params: {
					From: process.env.TWILIO_NUMBER,
					To: sendNumber,
					Body: text
				}, auth:
				process.env.TWILIO_ACCOUNT_SID + ':' + process.env.TWILIO_AUTH_TOKEN
			}, function (error) {
				if (error)
					console.log(error);
				else
					console.log('SMS sent!');
			});
		}
	});
}