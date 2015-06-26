var trackList, currentPosition, currentPointer, playerPointer, allowedToPlay, playedSoFar, randomOn;


$(document).ready(function () {
	$("#player").bind("ended", function () {
		if (allowedToPlay === playedSoFar) {
			playedSoFar = 0;
			play({
				status: "next-range"
			});
		} else {
			play({
				"status": "replay"
			});
		}
		playedSoFar++;
	});

	$("#randomize").on("click", function () {
		randomOn = true;
		$(this).attr("class", $(this).attr("class").replace("default", "danger"));
		$("#series").attr("class", $(this).attr("class").replace("danger", "default"));
	});

	$("#series").on("click", function () {
		randomOn = false;
		$(this).attr("class", $(this).attr("class").replace("default", "danger"));
		$("#randomize").attr("class", $(this).attr("class").replace("danger", "default"));
	});

	$("#pause").on("click", function () {
		if (playerPointer.paused) {
			$(this).attr("class", $(this).attr("class").replace("danger", "default"));
			playerPointer.play();
		} else {
			$(this).attr("class", $(this).attr("class").replace("default", "danger"));
			playerPointer.pause();
		}
	});


	$(".replay-number").on("click", function (event) {
		if (event.target.id === "replay-1") {
			allowedToPlay = 1;
		} else if (event.target.id === "replay-2") {
			allowedToPlay = 2;
		} else if (event.target.id === "replay-3") {
			allowedToPlay = 3;
		}
		setReplayIcons(allowedToPlay);
	});


	$("#nextTrackRange").on("click", function () {
		playedSoFar = 0;
		play({
			status: "next-range"
		});
	});

	$("#previousTrackRange").on("click", function () {
		playedSoFar = 0;
		play({
			status: "previous-range"
		});
	});

	$("body").keydown(function (e) {
		if (e.keyCode === 32) {
			$("#pause").trigger("click");
			return;
		} else if (e.keyCode === 39) {
			$("#nextTrackRange").trigger("click");
		} else if (e.keyCode === 37) {
			$("#previousTrackRange").trigger("click");
		}
	});

	$("#save-position").on("click", function () {
		setCookie("citizenship", currentPointer.trackNumber, 3);
	});

	$("#load-position").on("click", function () {
		if (getCookie("citizenship") !== "") {
			play({
				status: "cookie",
				trackNumber: parseInt(getCookie("citizenship"))
			})
		}
	});

	initialize();
	play({
		status: "next-range"
	});
});



function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	var expires = "expires=" + d.toUTCString();
	document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') c = c.substring(1);
		if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
	}
	return "";
}

function play(audioObject) {
	var trackNumber;
	if (audioObject.status === "next-range") {
		if (randomOn)
			trackNumber = getRandomNumber();
		else if (currentPointer.trackNumber === 100)
			trackNumber = 1;
		else
			trackNumber = currentPointer.trackNumber + 1;
		setResult();
	} else if (audioObject.status === "replay") {
		trackNumber = currentPointer.trackNumber;
	} else if (audioObject.status === "previous-range") {
		if (currentPointer.trackNumber === 1)
			trackNumber = 100
		else
			trackNumber = currentPointer.trackNumber - 1;
	} else if (audioObject.status === "cookie") {
		trackNumber = currentPointer.trackNumber;
	}


	currentPointer = {
		trackNumber: trackNumber
	}
	trackList.push(currentPointer);
	currentPosition++;

	playerPointer.setAttribute("src", "./audio/Track (" + currentPointer.trackNumber + ").mp3");
	playerPointer.play();
	printOnScreen();
}


function getRandomNumber() {
	return Math.floor((Math.random() * 100) + 1);
}

function setReplayIcons(number) {
	$(".replay-number").children().each(function (index, element) {
		if (element.getAttribute("id").indexOf(number) > -1) {
			element.setAttribute("class", element.getAttribute("class").replace("default", "success"));
		} else {
			element.setAttribute("class", element.getAttribute("class").replace("success", "default"));
		}
	});
}

function printOnScreen() {
	$("#slide-show-2").attr("attr", "Question #:" + currentPointer.trackNumber);
	$("#slide-show-1").attr("src", "./images/slide (" + (currentPointer.trackNumber * 2 - 1) + ").jpg");
	$("#slide-show-2").attr("src", "./images/slide (" + (currentPointer.trackNumber * 2) + ").jpg");
	$("#comment").append("Playing Question Number --> " + currentPointer.trackNumber + "\n");
}

function initialize() {
	trackList = [];
	playedSoFar = 1;
	currentPosition = 0;
	playerPointer = document.getElementById("player");
	playerPointer.volume = 0.5;
	$("#randomize").trigger("click");
	$("#replay-1").trigger("click");
	currentPointer = {
		status: "next",
		trackNumber: 0
	};
	$("[data-toggle='tooltip']").tooltip();
	setInterval(function () {
		$("#comment").animate({
			scrollTop: $("#comment")[0].scrollHeight - $("#comment").height()
		}, 500);
	}, 1000);
}

function setResult(){
	$.ajax({
		url: "../setResult",
		method: "POST",
		dataType: "json",
		data: {
			value: 0.5
		}
	});
}
