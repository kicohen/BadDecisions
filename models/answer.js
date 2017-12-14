var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var answerSchema = new Schema({
	description: String,
	question_id: Schema.ObjectId,
	score: Number
})

var Answer = mongoose.model('Answer', answerSchema);

module.exports = Answer;
