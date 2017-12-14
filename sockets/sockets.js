var Question = require("../routes/questionRoutes.js");
var Answers = require("../routes/answerRoutes.js");
var User = require("../routes/userRoutes.js");

exports.init = function (io) {
    io.on('connection', function (socket) {
        console.log("Connected a user.");
        
        // Start page for the application.
        socket.emit('showHome', {});

        // Logs out the current user.
        socket.on("logout", function(data) {
            socket.emit("showHome");
        })

        // Registers a new user.
        socket.on("register", function (data) {
            User.newUser(data.firstName, data.lastName, data.email, function() {});
        });

        // Creates a new question.
        socket.on("createQuestion", function(data) {
            var location = new Object();
            location.latitude = data.latitude;
            location.longitude = data.longitude;
            Question.createQuestion(data.question, data.user, data.time, JSON.stringify(location), function(question) {
                var answers = data.answers.split(",");
                for (var i = 0; i< answers.length; i++) {
                    Answers.createAnswer(answers[i], question.id, function() {});
                }
            });
        });

        // Increments the answer score for a given answer to a question.
        socket.on("answeredQuestion", function(data) {
            Answers.incrementAnswerScore(data.answer, function() {})
            socket.emit("ready", {});
        });

        socket.on("getQuestion", function(data) {
            User.getUser(data.email, function(user) {
                // Get next question based on time, location and user. 
                Question.getNextQuestion(data.questionsSeen, user, function(question) {
                    // If no questions are left.
                    if (question == undefined) {
                        socket.emit("noQuestions", {});
                    } else {
                        Answers.getAnswersByQuestion(question._id, function(answers) {
                            socket.emit("showQuestion", {
                                question: question,
                                answers: answers,
                                id: question.id
                            })
                        })
                    }
                })
            })
        });

        // Returns all the questions that the user has asked. 
        socket.on("getUsersQuestions", function(data) {
            User.getUser(data.email, function(user) {
                Question.getUsersQuestions(user.id, function(questionList) {
                    socket.emit("showUsersQuestions", {
                        questions: questionList
                    });
                });
            })
        });

        // Gets the results for the given function.
        socket.on("getResults", function(data) {
            Answers.getAnswersByQuestion(data.question, function(answers) {
                Question.getById(data.question, function(question) {
                    socket.emit("showResults", {
                        question: question,
                        answers: answers
                    });
                });
            });
        });
    });
}