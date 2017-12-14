var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
	email: { type : String , unique : true, required : true },
	first_name: String,
	last_name: String
})

var User = mongoose.model('User', userSchema);

module.exports = User;