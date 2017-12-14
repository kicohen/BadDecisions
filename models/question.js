var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var questionSchema = new Schema({
	description: String,
	user_id: Schema.ObjectId,
	expiration: Date,
	location: String
})

var Question = mongoose.model('Question', questionSchema);

module.exports = Question;
