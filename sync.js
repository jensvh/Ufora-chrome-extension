function getCalendarJson() {
	var links = document.getElementsByClassName("page-footer")[0].getElementsByClassName("pull-right")[0].getElementsByTagName("a");
	var btn = links[links.length-1];
	var link = btn.getAttribute("href");
	var url = "https://centauro.ugent.be/kalender" + link.split(".")[1] + ".IBehaviorListener.1-tabs-panel-kalenderBekijkenPanel-calendar&start=2020-02-11&end=2020-02-11";
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", url, false);
	xmlHttp.send(null);
	var json = JSON.parse(xmlHttp.responseText);
	for (var i = 0; i < json.length; i++) {
		//console.log(json[i].className);
	};
	return json;
}