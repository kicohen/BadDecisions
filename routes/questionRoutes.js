var Question = require('../models/question');
var User = require('../routes/userRoutes');
var mongoose = require('mongoose');

// *********************************************************************
//                              Helpers
// *********************************************************************

// Adds the ability to add hours to the builtin date object
Date.prototype.addHours= function(h){
    this.setHours(this.getHours()+h);
    return this;
}

// Turns a string into a datetime expiration for a period from now
function getExpiration(expirationString) {
	switch(expirationString) {
		case "24h":
			return new Date().addHours(24);
		case "4h": 
			return new Date().addHours(4);
		case "1h":
			return new Date().addHours(1);
		default:
			return new Date().addHours(24);
	}
}

// Creates a new question in the database with given parameters
exports.createQuestion = function(description, email, expiration, location, callback) {
	User.getUser(email, function(user) {
		var question = new Question({
			description: description,
			user_id: user.id,
			expiration: getExpiration(expiration),
			location: location
		});

		question.save(function(err) {
			if (err) console.log(err);
			callback(question);
		})
	});
}

// Gets a user based on the given user_id
exports.getUsersQuestions = function(user_id, callback) {
	Question.find({ user_id: user_id}, function(err, questions) {
	    if (err) console.log(err);
	 	callback(questions);
	});
}

exports.getById = function(id, callback) {
	Question.findById(id, function(err, question) {
		if (err) throw err;
		callback(question);
	});
}

function convertStringsToIds(ar) {
	var newArray = new Array();
	for (var i = 0; i < ar.length; i++) {
		newArray.push(mongoose.Types.ObjectId(ar[i]));
	}
	return newArray;
}


exports.getNextQuestion = function(questionsSeen, user, callback) {
	Question.aggregate(
	[ {$match: {
		_id: {$nin: convertStringsToIds(questionsSeen)},
		user_id: {$nin: new Array(user._id)}
	}}, { $sort: 
		{ expiration : -1 }
	}, { $sample: 
		{size: 1}
	}], 
	function(err, result) {
		if (err) console.log(err); 
		callback(result[0]);
	});
}
