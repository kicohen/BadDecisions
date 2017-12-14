$("#title-block a").click(function() {
	if (localStorage.getItem("email") == null)
		register();
	else {
		showMenu();
	}
});

$("#logo a").click(function() {
	if (localStorage.getItem("email") != null) {
		showMenu();
	} else {
		socket.emit("logout", {});
	}
})

parseName = function(name) {
	var firstName = name.split(",")[1];
	var lastName = name.split(",")[0];
	localStorage.setItem("firstName", firstName);
	localStorage.setItem("lastName", lastName);
}

var position;

setLocation = function(pos) {
	position = pos;
}

getLocation = function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setLocation);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

showQuestionAskingSequence = function() {
	showForm("What can we help you decide?", "Write a simple question.", function(question) {
		showForm("What are the possible answers?", "Answer 1, answer 2, ...", function(answers) {
			showQuestion("How soon do you need an answer?", ["ASAP", "1 hour", "6 hours", "1 day"], function(time) {
				addQuestionToDatabase({
					question: question,
					answers: answers,
					time: time.target.innerHTML,
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
					user: localStorage.getItem("email")
				});
				showMenu();
			});
		});
	});
}

showMenu = function() {
	getLocation();
	showQuestion("What would you like to do?", ["Ask a Question", "Answer Questions", "View My Questions", "Log Out"], function(answer) {
		if (answer.target.innerHTML.toLowerCase().includes("ask")) {
			showQuestionAskingSequence();
		} else if (answer.target.innerHTML.toLowerCase().includes("answer")) {
			getQuestion();
		} else if (answer.target.innerHTML.toLowerCase().includes("my")) {
			getMyQuestions();
		} else if (answer.target.innerHTML.toLowerCase().includes("log")) {
			localStorage.removeItem("email");
			localStorage.removeItem("firstName");
			localStorage.removeItem("lastName");
			socket.emit("logout", {});
		}
	})
}

register = function() {
	showForm("Hi, what is your name?", "Last name, first name", function(name) {
		parseName(name);
		showForm("What is your email?", "example@decisions.com", function(email) {
			localStorage.setItem("email", email);
			sendRegistrationToServer();
			showMenu();
		});
	});
}