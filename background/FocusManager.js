class FocusManager {
    constructor() {
        if (window.FaceDetector == undefined) {
            console.error("FocusManager : The browser do not support Face Detector.");
            return;
        }

        this.video = null;
        this.canvas = null;
        this.image = null;
        
        this.width = 320;
        this.height = 0;

        this.streaming = null;

        this.firstError = true;
        this.focus = false;
    }

    initialize(_video, _canvas, _image) {
        this.video = _video;
        this.canvas = _canvas;
        this.image = _image;
        
        navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false
            })
            .then((stream) => {
                stream.stop = function () {
                    this.getVideoTracks().forEach((track) => {
                        track.stop();
                    });
                };
                this.video.srcObject = stream;
                this.video.play();
            })
            .catch((e) => {
                console.log("FocusManager : error occurred" + e);
            });
        
        this.video.addEventListener('canplay', (ev) => {
            if (!this.streaming) {
                this.streaming = true;

                this.height = video.videoHeight / (video.videoWidth / this.width);
                if (isNaN(this.height))
                    this.height = this.width / (4 / 3);
        
                this.video.setAttribute('width', this.width);
                this.video.setAttribute('height', this.height);

                this.canvas.setAttribute('width', this.width);
                this.canvas.setAttribute('height', this.height);
            }
        }, false);

        this._clearImage();
    }

    _clearImage() {
        var context = this.canvas.getContext('2d');
        context.fillStyle = "#AAA";
        context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
        var imgUrl = this.canvas.toDataURL('image/png');
        this.image.setAttribute('src', imgUrl);
    }

    _takePicture() {
        var context = this.canvas.getContext('2d');

        if (this.width && this.height) {
            this.canvas.width = this.width;
            this.canvas.height = this.height;
            context.drawImage(this.video, 0, 0, this.width, this.height);
    
            var imgUrl = this.canvas.toDataURL('image/png');
            this.image.setAttribute('src', imgUrl);

            return imgUrl;
        }
        else {
            this._clearImage();
            return null;
        }
    }

    _detect() {
        var faceDetector = new FaceDetector();
        faceDetector.detect(this.image)
            .then ((faces) => {
                if (this.firstError) {
                    this.firstError = false;
                    return;
                }
                if (faces.length > 0) {
                    this.focus = true;
                    console.log("FocusManager : " + faces.length + " face(s) are found");
                }
                else if (this.focus) {
                    this.focus = false;
                    console.log("FocusManager : no face(s) are found");
                    alert("Focus on the lecture!");
                }
            })
            .catch ((e) => {
                console.error("FocusManager : error occurred : " + e);
            });
    }

    startInterval(_interval) {
        if (_interval == null)
            _interval = 2000;
        
        var fmInterval = setInterval(function (focusManager) {
            var imgUrl = focusManager._takePicture();
            if (imgUrl != null) {
                focusManager.image.setAttribute('src', imgUrl);
                focusManager._detect();
            }
        }, _interval, this);

        return fmInterval;
    }

    stopInterval(_fmInterval) {
        clearInterval(_fmInterval);
        this.video.srcObject.stop();
        this.video.pause();
    }
}