function getJson() {
	var event_divs = document.querySelectorAll('div.bookingDiv.fgDiv');
	var json = {
		"events": []
	};

	for (var i = 0; i < event_divs.length; i++) {
		// " 26-09-2022 10:00 - 11:30 E019370A, Robotics, hoorcollege, Studentenfoyer 0.1, Campus Ardoyen, Alain Sarlette, Tony Belpaeme Id 108289"
		var temp = event_divs[i].title.split(' ');
		const date = temp[1].split('-');
		const start_time = temp[2];
		const end_time = temp[4];
		temp = event_divs[i].title.split(', ');
		const title = temp[1];
		const type_of_les = temp[2];
		const place = temp[3];
		const campus = temp[4];

		// 2020-02-10T08:30:00+01:00
		json.events[i] = {
			"title": title,
			"start": date[2]+"-"+date[1]+"-"+date[0] + "T" + start_time+":00+02:00",
			"end": date[2]+"-"+date[1]+"-"+date[0] + "T" + end_time+":00+02:00",
			"description": type_of_les,
			"loc": place + ", " + campus
		};
	}

	console.log(json);

	return json;
}

chrome.runtime.sendMessage({
	action: "getJson",
	source: getJson()
});