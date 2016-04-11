/* Created by Vince Dang */

if (Meteor.isServer) {

	Meteor.publish('backups', function () {
		return Backups.find({}, {sort: {option: 1}});
	}); 
	Meteor.publish('incidents', function() {
		return Incidents.find();
	}); 
	Meteor.publish('requests', function() {
		return Requests.find();
	}); 
	Meteor.publish('hazeDatas', function() {
		return HazeDatas.find();
	}); 
	Meteor.publish('dengueDatas', function() {
		return DengueDatas.find();
	});
	Meteor.publish('users', function() {
		return Meteor.users.find();
	})
	/* Publish the backup option list to client (actually only the one with
	 largest option value) */

	Accounts.config({
		forbidClientAccountCreation : true
	});

	var codeGen = function () {
		var d = new Date();
		var n = d.getTime();
		var password = Math.floor(n/1000001) * (n % 1000001);
		password %= 10000000001;
		console.log('New time: ' + n);
		console.log('New code: ' + password);
		return password;
	}
	/* Generate an activation code*/

	var activationCode = codeGen();
	var password = setInterval(function () {
		activationCode = codeGen();
	}, 300000);
	/* Periodically refresh the activation code by an interval of 5 min */

	isAdmin = false;

	Meteor.startup(function () {
		process.env.TWILIO_ACCOUNT_SID = 'AC061f3261f802d23a6dd90f35a3eefa71';
		process.env.TWILIO_AUTH_TOKEN = '024296fd85ec53f8e75569944800c343';
		process.env.TWILIO_NUMBER = '+12035806804';
		if (Admins.find().fetch().length) {
			console.log('has admin already');
		} else {
			Admins.insert({username: "admin", password: "admin"});
		}
		if (Backups.find().fetch().length) {
			console.log('has backup');
		} else {
			Backups.insert({option: "0", number: "+6583567597", name: "System"});
		}
		// Accounts.createUser({
		// 	username: "admin", password: "admin"
		// });
		/* Twilio account details */
			// Accounts.createUser({
			// 	username: 'duc',
			// 	password: '123123'
			// });
			// console.log('user created');
	});

	// Accounts.onCreateUser(function (options, user) {
	// 	if (this.userId)
	// 		return null;
	// 	else return user;
	// });
	/* If an user is created from the client side, reject it and return a null
	 object (needs to be cleaned up periodically */

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
		/* Send a message using the Twilio API */
		changeNumber: function (option, number) {
			var agencyNumber = Backups.findOne({option: String(option)});
			Backups.update(agencyNumber._id, {$set: {number: number}});
			console.log('Option ' + option + ' changed to ' + number + '!');
		},
		/* Change the number of a specific option */
		addAgency: function (option, name, number) {
			console.log('Agency: ' + name + ' added with ' + number + '!');
			Backups.insert({option: String(option), name: name, number: number});
		},
		/* Add an agency (new option) with its phone number to the database */

		sendCode: function () {
			Meteor.call('sendMessage', 0, activationCode);
			console.log('Activation code sent to administrator!');
		},
		/* Send the activation code to the operator (send option=0) - reuse sendMessage function*/
		authenticateCode: function (inputCode) {
			if (Number(inputCode) == activationCode)
				console.log('Panic Mode On!');
			else
				console.log('Wrong Activation Code');
		},
		/* Authenticate the code input by user */
		addIncident: function(wrap) {
			Incidents.insert(wrap, function(err) {
				if (err) {
					throw new Meteor.Error(err);
				}
			});
		},
		authenticateAdmin: function(username, password) {
			console.log('Input: ' + username + ' ' + password);
			var admin = Admins.findOne({username: username});
			if (admin.password == password) {
				isAdmin = true;
				return true;
			}
			else {
				return false;
			}
		},
		logoutAdmin: function() {
			isAdmin = false;
		},
		isAdmin: function() {
			return isAdmin;
		},
		createOperator: function(username, password) {
			Accounts.createUser({
				username: username, password: password
			});
		},
		removeOperator: function(id) {
			console.log(id);
			console.log(typeof id);
			Meteor.users.remove({_id: id});
		}
	});
}