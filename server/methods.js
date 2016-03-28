if (Meteor.isServer) {

	Meteor.publish('backups', function () {
		return Backups.find({}, {sort: {option: -1}, limit: 1});
	});

	Meteor.startup(function () {
		process.env.TWILIO_ACCOUNT_SID = 'AC061f3261f802d23a6dd90f35a3eefa71';
		process.env.TWILIO_AUTH_TOKEN = '024296fd85ec53f8e75569944800c343';
		process.env.TWILIO_NUMBER = '+12035806804';
	});

	Meteor.methods({
		sendMessage: function (option, text) {
			var agencyNumber = Backups.findOne({option: String(option)});
			var sendNumber = agencyNumber.number;
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
		},
		changeNumber: function (option, number) {
			var agencyNumber = Backups.findOne({option: String(option)});
			Backups.update(agencyNumber._id, {$set: {number: number}});
			console.log('Option ' + option + ' changed to ' + number + '!');
		},
		addAgency: function (option, number) {
			console.log('added ' + number + '!');
			Backups.insert({option: String(option), number: number});
		}
	});
}