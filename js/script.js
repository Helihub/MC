// Reference to video element.
var video = document.getElementById('video'),
    canvas = document.getElementById('canvas'),
    canvas_context = canvas.getContext('2d'),
    vendorURL = window.URL || window.webkitURL;

var errorCallback = function (e) {
    // User rejected camera request. Handle appropriately.
    console.log("error bei error callback: " + e.message);
};

// Ensure cross-browser functionality.
navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

if (navigator.getUserMedia) {
    navigator.getUserMedia({
        video: true, audio: false
    }, function (stream) {
        video.src = vendorURL.createObjectURL(stream);
        video.play();
    }, errorCallback);
} else {
    console.log("dont support "); //debug
    video.src = 'somevideo.webm'; // fallback.
}

video.addEventListener('play', function () {
    draw(this, canvas_context, canvas.width, canvas.height);
}, false);

function draw(video, context, width, height) {
    var image, data, i, r, g, b, brightness;

    context.drawImage(video, 0, 0, width, height);
    image = context.getImageData(0, 0, width, height);
    data = image.data;

    for (i = 0; i < data.length; i = i + 4) {
        r = data[i];
        g = data[i + 1];
        b = data[i + 2];
        modifyData(data, r, i, g, i + 1);
    }

    image.data = data;
    context.putImageData(image, 0, 0);
    setTimeout(draw, 10, video, context, width, height);
}

function modifyData(data, firstHue, firstChannel, secondHue, secondChannel) {
    data[firstChannel] = data[secondChannel] = (firstHue + secondHue) / 2;
}

function permissionRQT() { //block undo
    navigator.getUserMedia({
        video: true
    }, function (stream) {
        video.src = vendorURL.createObjectURL(stream);
        video.play();
    }, errorCallback)
}

function cameraSwap() {
    //TODO
}