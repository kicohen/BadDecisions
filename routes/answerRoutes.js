var Answer = require('../models/answer');

getTotal = function(answers) {
	var total = 0;
	for (var i = 0; i < answers.length; i++) {
		total += answers[i].score;
	}
	for (var i = 0; i < answers.length; i++) {
		answers[i].percentage = (answers[i].score / total) * 100;
	}
	return answers;
}

function cleanAnswer(answer) {
	return answer.replace(/^\s+|\s+$/g, '');
}

exports.createAnswer = function(description, question_id, callback) {
	var answer = new Answer({
		description: cleanAnswer(description),
		question_id: question_id,
		score: 0
	});

	answer.save(function(err) {
		if (err) console.log(err);
		else callback();
	})
}

exports.getAnswersByQuestion = function(question_id, callback){
	Answer.find({ question_id: question_id }, function(err, answers) {
	    if (err) console.log(err);
	    callback(getTotal(answers));
	}).lean().exec();
}

exports.incrementAnswerScore = function(answer_id, callback) {
	Answer.findById(answer_id, function(err, answer) {
		if (err) throw err;

		answer.score += 1;

		answer.save(function(err) {
			if (err) console.log(err);
			else callback();
		});
	});
}
