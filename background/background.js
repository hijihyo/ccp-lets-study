var faceChecker = null;

var width = 320; // We will scale the photo width to this
var height = 0; // This will be computed based on the input stream

var streaming = false;

var video = null;
var canvas = null;
var photo = null;
var startbutton = null;

var hasStarted = false;

var data_url = null;

chrome.runtime.onInstalled.addListener(function () {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: { hostEquals: 'zoom.us', schemes: ['https']},
                })
            ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});

function startup() {
    video = document.getElementById('video');
    canvas = document.getElementById('canvas');
    photo = document.getElementById('photo');

    // access video stream from webcam
    navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
        })
        // on success, stream it in video tag
        .then(function(stream) {
            video.srcObject = stream;
            video.play();
        })
        .catch(function(err) {
            console.log("An error occurred: " + err);
        });

    video.addEventListener('canplay', function(ev) {
        if (!streaming) {
            height = video.videoHeight / (video.videoWidth / width);

            if (isNaN(height)) {
                height = width / (4 / 3);
            }

            video.setAttribute('width', width);
            video.setAttribute('height', height);
            canvas.setAttribute('width', width);
            canvas.setAttribute('height', height);
            streaming = true;
        }
    }, false);

    clearphoto();
}

function clearphoto() {
    var context = canvas.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    var data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
}

function takepicture() {
    var context = canvas.getContext('2d');
    if (width && height) {
        canvas.width = width;
        canvas.height = height;
        context.drawImage(video, 0, 0, width, height);

        var data = canvas.toDataURL('image/png');
        photo.setAttribute('src', data);
        return data;
    } else {
        clearphoto();
        return null;
    }
}

function detect() {
    if (window.FaceDetector == undefined) {
        console.error('Face Detection not supported');
        return;
    }
  
    var faceDetector = new FaceDetector();
    faceDetector.detect(photo)
      .then(faces => {
        if (faces.length > 0)
            console.log("Face detected! Total " + faces.length);
        else {
            console.log("Face doesn't exist.");
            alert("Focus!!!");
        }
      })
      .catch((e) => {
        console.error("Boo, Face Detection failed: " + e);
      });
  }

chrome.runtime.onMessage.addListener(function (msg, callback) {
    if (msg == "inZoom") {
        if (!hasStarted)
            startup();

        // console.log(msg);

        faceChecker = setInterval(function () {
            data_url = takepicture();
        
            // console.log(data_url);

            if (data_url) {
                photo.setAttribute('src', data_url);
                detect();
            }
        }, 5000);
    }
})