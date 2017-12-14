let pages = ["#title-block", "#question-page", "#form-page", "#results-page"];

function hideAll() {
	for (var i = 0; i < pages.length; i++){
		if (!$(pages[i]).hasClass("hidden"))
			$(pages[i]).addClass("hidden");
	}
}

function hideLogo() {
	if (!$("#logo").hasClass("hidden"))
		$("#logo").addClass("hidden");
}

function showLogo() {
	if ($("#logo").hasClass("hidden"))
		$("#logo").removeClass("hidden");
}

function showHome() {
	hideAll();
	hideLogo();
	$("#title-block").removeClass("hidden");
}

function showQuestion(question, answers, onselect) {
	hideAll();
	showLogo();
	$("#question-page .question span").html(question);
	$("#question-page .answers").html("");
	for (var i = 0; i<answers.length; i++) {
		$("#question-page .answers").append("<li><span>" + answers[i] + "</li></span>");
	}
	$("#question-page").removeClass("hidden");
	$("#question-page").off("click");
	$("#question-page li").off("click");
	$("#question-page .answers").off().on("click","li",function(event) {
		onselect(event);
		$("#question-page").off("click");
		$("#question-page li").off("click");
	})
}

function showQuestionWithIds(question, answers, onselect) {
	hideAll();
	showLogo();
	$("#question-page .question span").html(question);
	$("#question-page .answers").html("");
	for (var i = 0; i<answers.length; i++) {
		$("#question-page .answers").append("<li><span id='" + answers[i]._id + "'>" + answers[i].description + "</li></span>");
	}
	$("#question-page").removeClass("hidden");
	$("#question-page").off("click");
	$("#question-page li").off("click");
	$("#question-page .answers").off().on("click","li",function(event) {
		onselect(event);
		$("#question-page").off("click");
		$("#question-page li").off("click");
	})
}

function showForm(question, placeholder, onsubmit) {
	hideAll();
	showLogo();
	$("#form-page h3").html(question);
	$("#form-page input").val('');
	$("#form-page input").attr("placeholder", placeholder);
	$("#form-page input").off("keydown");
	$("#form-page input").keydown(function(event) {
		if (event.which == 13) {
			onsubmit($("#form-page input").val());
		}
	});
	$("#form-page").removeClass("hidden");
}

function showResults(question, answers) {
	hideAll();
	showLogo();
	$("#results-page h3 span").html(question);
	$("#results-page ul").html("");
	for (var i=0; i<answers.length; i++){
		$("#results-page ul").append(
			"<li>" + answers[i].description + "<br>" + 
			"<div style='width:" + (answers[i].percentage) + "%'></div>" + 
			"<span>" + answers[i].percentage + "%<span></li>"
		);
	}
	$("#results-page").removeClass("hidden");
}

function showNoQuestions() {
	hideAll();
	showLogo();
	$("#question-page .question span").html("No Questions left to answer");
	$("#question-page .answers").html("");
	$("#question-page").removeClass("hidden");
}