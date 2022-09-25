chrome.runtime.onInstalled.addListener(function() {
	chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
		chrome.declarativeContent.onPageChanged.addRules([{
			conditions: [new chrome.declarativeContent.PageStateMatcher({
				pageUrl: {
					urlMatches: '.*cloud.timeedit.net/ugent/web/student/.*.html'
				}
			})
			],
				actions: [new chrome.declarativeContent.ShowPageAction()]
		}]);
	});
});