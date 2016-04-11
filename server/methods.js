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

	var reportGen = function (incident) {
       	var content = "";
       	for (i = 0; i < incident.length; i++) {
       		var type = incident[i].type;
       		var time = incident[i].timestamp;
       		var location = incident[i].location;
       		var detail = incident[i].details;
       		var resouceName = incident[i].resourceRequested.name;
       		var resourceQuantity = incident[i].resourceRequested.quantity;
        	var record = "Incident " + type + "\n"
        				+ "Time: " + time + "\n"
        				+ "Location: " + location + "\n"
        				+ "Details: " + detail + "\n"
        				+ "Resource Requested: " + resouceName + " x " + resourceQuantity + "\n\n";
        	content += record;
        }
        return content;
    };
       /* Generate a text-based report */
    var sendReport = function (incident) {
		// Define the settings
		var postURL = process.env.MAILGUN_API_URL + '/' + process.env.MAILGUN_DOMAIN + '/messages';
		var options =   {
			auth: process.env.MAILGUN_API_KEY,
			params: {
				"from":"CENA CMS <donotreply@sandboxff6511ffc2fd4416b885d7f404de131a.mailgun.org>",
				"to":['xuanvu.24711@gmail.com'],"subject": 'Auto-generate Crisis Management Report',
				"text": reportGen(incident),
			}
		};
	        // Send the request
        Meteor.http.post(postURL, options, function(err) {
        	if (err) {
        		console.log(err);
        		throw new Meteor.Error(err);
        	} else {
        		console.log('Email sent!');
        	}
        });
    };
    /* Send an email using Mailgun API */

    var Fiber = Npm.require('fibers');
	var report = setInterval(function () {
		Fiber(function () {
			incident = Incidents.find().fetch();
			sendReport(incident);
		}).run();
	}, 180000);
	/* Periodically sent an auto-generated report to the government office by an interval of 3 min (for testing) */

	isAdmin = false;
	isCrisis = false;

	Meteor.startup(function () {
		process.env.TWILIO_ACCOUNT_SID = 'AC061f3261f802d23a6dd90f35a3eefa71';
		process.env.TWILIO_AUTH_TOKEN = '024296fd85ec53f8e75569944800c343';
		process.env.TWILIO_NUMBER = '+12035806804';

		process.env.MAILGUN_API_KEY = "api:key-63a72c60f684bf68fa984654d2c0f09d";  
		process.env.MAILGUN_DOMAIN = "sandboxff6511ffc2fd4416b885d7f404de131a.mailgun.org";  
		process.env.MAILGUN_API_URL = "https://api.mailgun.net/v3";

		if (!Admins.find().fetch().length) {
			Admins.insert({username: "admin", password: "admin"});
			Accounts.createUser({username: "admin", password: "admin"});
		}
		if (!Backups.find().fetch().length) {
			Backups.insert({option: "0", number: "+6583567597", name: "System"});
			Backups.insert({option: "1", number: "+6597169634", name: "Singapore Civil Defense Force"});
			Backups.insert({option: "2", number: "+6586984010", name: "Singapore Power"});;
		}
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
			}, function (err) {
				if (err) {
					console.log(err);
					throw new Meteor.Error(err);
				}
				else {
					console.log('SMS sent!');
				}
			});
		},
		/* Send a message using Twilio API */
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
		switchPanicMode: function (inputCode) {
			if (Number(inputCode) == activationCode) {
				console.log('Panic Mode On!');
				isCrisis = !isCrisis;
			}
			else {
				console.log('Wrong Activation Code');
			}
			return isCrisis;
		},
		/* Authenticate the code input by user */
		addIncident: function(wrap) {
			Incidents.insert(wrap, function(err) {
				if (err) {
					throw new Meteor.Error(err);
				}
			});
		},
		/* Add an incident to the database */
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
		/* Authenticate if the user logging in is an admin */
		logoutAdmin: function() {
			isAdmin = false;
		},
		/* Log the admin out */
		isAdmin: function() {
			return isAdmin;
		},
		/* Token to indicate admin status */
		createOperator: function(username, password) {
			Accounts.createUser({
				username: username, password: password
			});
		},
		/* Add a new operator to the system */
		removeOperator: function(id) {
			console.log(id);
			console.log(typeof id);
			if (Meteor.users.findOne({_id: id})) {
				Meteor.users.remove({_id: id});
				return true;
			} else {
				return false;
			}
		},
		/* Remove an operator from database */
	});
}