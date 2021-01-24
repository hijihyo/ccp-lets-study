var focusManager = new FocusManager();
var fmInterval = null;

var interval = 2000;
var hostList = ['zoom.us', 'www.youtube.com'];

chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({ hostList: hostList, interval : interval }, null);
    chrome.storage.onChanged.addListener(function (obj, areaName) {
        if (areaName != "sync")
            return;

        if ('interval' in obj) {
            chrome.storage.sync.get(['interval'], function(result) {
                interval = result['interval'];
            });
        }
        if ('hostList' in obj) {
            chrome.storage.sync.get(['hostList'], function(result) {
                hostList = result['hostList'];
                var conditionList = [];
                for (let host of hostList) {
                    conditionList.push(
                        new chrome.declarativeContent.PageStateMatcher({
                            pageUrl: { hostEquals: host, schemes: ['https']},
                        })
                    );
                }
                chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
                    chrome.declarativeContent.onPageChanged.addRules([{
                        conditions: conditionList,
                        actions: [new chrome.declarativeContent.ShowPageAction()]
                    }]);
                });
            });
        }
    })
});

chrome.runtime.onMessage.addListener(function (msg, callback) {
    if (typeof msg == "string") {
        if (msg == "startFocusManager") {
            if (fmInterval != null) {
                console.error("FocusManager Interval already exists");
                return;
            }
            focusManager.initialize(
                _video = document.getElementById("video"),
                _canvas = document.getElementById("canvas"),
                _image = document.getElementById("image"),
            );
            fmInterval = focusManager.startInterval({
                _interval : interval
            });
        }
        else if (msg == "stopFocusManager") {
            if (fmInterval == null) {
                console.error("FocusManager Interval does not exist");
                return;
            }

            focusManager.stopInterval(fmInterval);
            fmInterval = null;
        }
    }
    else if (typeof msg == "object") {
        if ('interval' in msg) {
            chrome.storage.sync.set(msg, null);
        }
        if ('newHost' in msg) {
            chrome.storage.sync.get(['hostList'], function(result) {
                hostList = result['hostList'];
            });
            hostList.push(msg['newHost']);
            chrome.storage.sync.set({ hostList : hostList }, null);
        }
    }
})