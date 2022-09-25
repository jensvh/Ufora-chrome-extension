let syncBtn = document.getElementById('syncBtn');
let startDate = document.getElementById("start");
let endDate = document.getElementById("end");
let calendarSelect = document.getElementById("calendar");
let error = document.getElementById("error");

var json;
var auth = false;

var calendar_ID = "primary";

chrome.runtime.onMessage.addListener(function(request, sender) {
	if (request.action = "getJson") {
		console.log(request);
		json = request.source;
		console.log(json);
	}
});

function onWindowLoad() {
	// Set current date
	startDate.value = getToday();
	endDate.value = getToday(7);
	
	// execute script on current page
	chrome.tabs.executeScript(null, {
		file: "getJson.js"
	});
	
	// loggin
	auth(function() {
		getCalendars(function() {
			for (var i = 0; i < calendars.length; i++) {
				var calendar = calendars[i];
				calendarSelect.innerHTML += '<option value="' + calendar.id + '">' + calendar.summary + '</option>';
			}
		});
		auth = true;
	});
}
window.onload = onWindowLoad;

syncBtn.onclick = function() {
	console.log("Syncing...")
	// Check for correct inputs
	if (!checkDate(startDate.value) || !checkDate(endDate.value)) {
		error.innerHTML = "Invalid date.";
		return;
	}
	error.innerHTML = "";
	console.log('a');
	
	// Get calendarId
	calendar_ID = calendarSelect.options[calendarSelect.selectedIndex].value;
	
	// Get start date
	const start = document.getElementById("start").value;
	
	// Get end date
	const end = document.getElementById("end").value;
	console.log('b');
	// Check values
	if (start == null || start == "" || end == null || end == "") {
		error.innerHTML = "Some fields are empty.";
		return;
	}
	console.log('c');
	
	
	// Start request
	startRequests();
	console.log('d');
	
	// Remove existing events
	removeEvents(calendar_ID);
	console.log('e');
	// Add events
	addEvents(calendar_ID, json.events, start, end);
	console.log('f');
	// Check when is finished
	checkFinished();
	console.log('g');
}

function checkDate(value) {
	if (value.match("^[0-9]{4}-[0-9]{2}-[0-9]{2}$") === null || value.length !== 10) {
		return false;
	}
	
	const split = value.split("-");
	if (split[0] >= 2020 && split[0] <= 2100 
		&& split[1] >= 1 && split[1] <= 12
		&& split[2] >= 1 && split[2] <= 31) {
		return true;
	}
	return false;
}

function getToday(offset = 0) {
	var date = new Date();
	var day = date.getDate() + offset;
	var month = date.getMonth() + 1;
	var year = date.getFullYear();
	
	if (day < 10) { day = "0" + day; }
	if (month < 10) { month = "0" + month; }
	var str = year + "-" + month + "-" + day;
	
	return str;	
}