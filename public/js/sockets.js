var socket = io();

socket.on('showHome', function (data) {
    showHome();
    if (localStorage.getItem("questionsSeen") == null) {
    	localStorage.setItem("questionsSeen", JSON.stringify(new Array()));
    }
})

socket.on("noQuestions", function(data) {
	showNoQuestions();
})

socket.on("showQuestion", function(data) {
	if (data.question == undefined) {
		console.log("Hello this question is undefined");
	} else {
		showQuestionWithIds(data.question.description, data.answers, function(answer) {
			sendQuestionResponse(data.id, answer.target.id);
		});
		var l = JSON.parse(localStorage.getItem("questionsSeen"));
		l.push(data.question._id);
		localStorage.setItem("questionsSeen", JSON.stringify(l));
	}
})

socket.on('showUsersQuestions', function(data) {
	showQuestionWithIds("Your Questions", data.questions, function(answer) {
		socket.emit("getResults", {
			question: answer.target.id
		});
	});
}); 

socket.on('showResults', function(data) {
	showResults(data.question.description, data.answers)
})

socket.on('ready', function(data) {
	getQuestion();
});

var sendRegistrationToServer = function() {
	var firstName = localStorage.getItem("firstName");
	var lastName = localStorage.getItem("lastName");
	var email = localStorage.getItem("email");
    socket.emit("register", {
        firstName: firstName,
        lastName: lastName,
        email: email
    });
};

function getQuestion() {
	socket.emit("getQuestion", {
		questionsSeen: JSON.parse(localStorage.getItem("questionsSeen")),
		email: localStorage.getItem("email"),
	});
}

function getMyQuestions() {
	var email = localStorage.getItem("email");
	socket.emit("getUsersQuestions", {
		email: email
	});
}

function sendQuestionResponse(questionId, answerId) {
	socket.emit("answeredQuestion", {
		answer: answerId
	});
}

function addQuestionToDatabase(data) {
	socket.emit("createQuestion", data)
}