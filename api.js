var auth_token;
var delay = 300;
var calendars;
var requestsToSend = 0;
var maxRequests = 1;

function startRequests() {
	requestsToSend = 0;
	maxRequests = 1;
	syncBtn.disabled = true;
}

function checkFinished() {
	if (requestsToSend > maxRequests) {
		maxRequests = requestsToSend;
	}
	
	error.innerHTML = "Syncing...<br>Progress: " + ((maxRequests - requestsToSend)/maxRequests * 100).toFixed(0) + "%";
	if (requestsToSend <= 0) {
		error.innerHTML = "Finished!";
		syncBtn.disabled = false;
	} else {
		setTimeout(checkFinished, 250);
	}
}

function auth(func) {
	chrome.identity.getAuthToken({ 'interactive': true}, function(token) {
		auth_token = token;
		func();
	});
}

function getCalendars(func) {
	const headers = new Headers({
		'Authorization': 'Bearer ' + auth_token
	});
	
	const queryParams = {headers};
	
	fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList?showDeleted=false', queryParams)
		.then((response) => response.json()) // Transform the data into json
		.then(function(data) {
			calendars = data.items;
			
			func();
		});
}

function removeEvents(calendarId) {
	// get all events
	const headers = new Headers({
		'Authorization': 'Bearer ' + auth_token,
		'Content-Type': 'application/json'
	});
	
	const queryParams = {headers};
	fetch('https://www.googleapis.com/calendar/v3/calendars/' + calendarId + '/events?singleEvents=true&showDeleted=false', queryParams)
		.then((response) => response.json())
		.then(function(data) {
			var events = data.items;
			console.log("Events to remove: " + events.length);
			for (var i = 0; i < events.length; i++) {
				var evnt = events[i];
				if (evnt.description === null || evnt.description === undefined) {
					continue;
				}
				
					removeEventWithDelay(calendarId, evnt.id, i * delay);
					requestsToSend++;
			}
			return events.length;
		});
}

function addEvents(calendarId, jsonData, start, end) {
	console.log("Events to add: " + jsonData.length);
	// Create event for each json data
	for (var i = 0; i < jsonData.length; i++) {
		var evnt = jsonData[i];
		console.log(evnt.start + " <=> " + start + ", " + evnt.end + " <=> " + end);
		if (evnt == null || evnt.end > end+"Z" || evnt.start < start) {
			console.log("continue");
			continue;
		}
			createEventWithDelay(calendarId, evnt, delay * i);
			requestsToSend++;
	}
	return jsonData.length;
}

function createEvent(calendarId, evnt) {
	// Get color
	const color = getColor(evnt.title);
	
	fetch('https://www.googleapis.com/calendar/v3/calendars/' + calendarId + '/events', {
		method: 'POST',
		headers: {
			'Authorization': 'Bearer ' + auth_token,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			"summary": evnt.title,
			"start": {
				"dateTime": evnt.start,
				"timeZone": "Europe/Brussels"
			},
			"end": {
				"dateTime": evnt.end,
				"timeZone": "Europe/Brussels"
			},
			"location": evnt.loc,
			"description": evnt.description,
			"colorId": color
		})
	}).then((response) => {
		requestsToSend--;
	});
}

function createEventWithDelay(calendarId, evnt, delay) {
	setTimeout(function() { createEvent(calendarId, evnt); }, delay);
}

function removeEventWithDelay(calendarId, eventId, delay) {
	setTimeout(function() { removeEvent(calendarId, eventId); }, delay);
}

function removeEvent(calendarId, eventId) {
	fetch('https://www.googleapis.com/calendar/v3/calendars/' + calendarId + '/events/' + eventId, {
		method: 'DELETE',
		headers: {
			"Authorization": 'Bearer ' + auth_token
		}
	}).then((response) => {
		requestsToSend--;
	});
}

const colors = [1,2,3,4,5,6,7,8,9,10,11]
var colorMap = new Map();

function getColor(title) {
	if (colorMap.has(title)) {
		return colorMap.get(title);
	}
	
	const color = colors[colorMap.size];
	colorMap.set(title, color);
	return color;
}