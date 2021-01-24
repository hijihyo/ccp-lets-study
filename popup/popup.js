window.onload = function () {
    var startBtn = document.getElementById("startBtn");
    startBtn.addEventListener("click", function () {
        chrome.runtime.sendMessage(chrome.runtime.id, "startFocusManager");
    });
    var stopBtn = document.getElementById("stopBtn");
    stopBtn.addEventListener("click", function () {
        chrome.runtime.sendMessage(chrome.runtime.id, "stopFocusManager");
    });
};