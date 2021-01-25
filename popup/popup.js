window.onload = function () {
    var startBtn = document.getElementById("startBtn");
    startBtn.addEventListener("click", function () {
        chrome.runtime.sendMessage(chrome.runtime.id, {
            type : "FocusManager",
            action : "start"
        });
    });
    
    var stopBtn = document.getElementById("stopBtn");
    stopBtn.addEventListener("click", function () {
        chrome.runtime.sendMessage(chrome.runtime.id, {
            type : "FocusManager",
            action : "stop"
        });
    });
};