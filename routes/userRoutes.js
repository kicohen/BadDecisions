var User = require('../models/user');

exports.newUser = function(firstName, lastName, email, callback) {
	var user = new User({
		first_name: firstName,
		last_name: lastName,
		email: email,
	});

	user.save(function(err) {
		if (err) console.log(err);
		callback();
	})
}

exports.getUser = function(email, callback) {
	return User.find({email: email}, function(err, user) {
		if (err) console.log(err);
		callback(user[0]);
	})
}