window.onload = function () {
    chrome.runtime.sendMessage(chrome.runtime.id, "inZoom");
};