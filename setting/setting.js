window.onload = function () {
    var intervalBtn = document.getElementById("intervalBtn");
    intervalBtn.addEventListener("click", function () {
        var newInterval = document.getElementById("interval").value;
        chrome.runtime.sendMessage(chrome.runtime.id, {
            type : "Storage",
            interval : newInterval
        });
    });
    var hostBtn = document.getElementById("hostBtn");
    hostBtn.addEventListener("click", function () {
        var newHost = document.getElementById("host").value;
        chrome.runtime.sendMessage(chrome.runtime.id, {
            type : "Storage",
            newHost : newHost
        });
    });
}