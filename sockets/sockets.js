var Question = require("../routes/questionRoutes.js");
var Answers = require("../routes/answerRoutes.js");
var User = require("../routes/userRoutes.js");

exports.init = function (io) {
    io.on('connection', function (socket) {
        console.log("Connected a user.");
        
        socket.emit('showHome', {});

        socket.on("logout", function(data) {
            socket.emit("showHome");
        })

        socket.on("register", function (data) {
            User.newUser(data.firstName, data.lastName, data.email, function() {});
        });

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

        socket.on("answeredQuestion", function(data) {
            Answers.incrementAnswerScore(data.answer, function() {})
            socket.emit("ready", {});
        });

        socket.on("getQuestion", function(data) {
            User.getUser(data.email, function(user) {
                Question.getNextQuestion(data.questionsSeen, user, function(question) {
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

        socket.on("getUsersQuestions", function(data) {
            User.getUser(data.email, function(user) {
                Question.getUsersQuestions(user.id, function(questionList) {
                    socket.emit("showUsersQuestions", {
                        questions: questionList
                    });
                });
            })
        });

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