// Reference to video element.
var video = document.getElementById('video'),
    canvas = document.getElementById('canvas'),
    canvas_context = canvas.getContext('2d'),
    vendorURL = window.URL || window.webkitURL,
    video_switch = document.getElementById('permission_switch');

var noPermision = function (e) {
    // User rejected camera request. Handle appropriately.
    cameraTurnedOff();
    console.log("error bei error callback: " + e.message); //TODO pictures and explain permission issues 
};

// Ensure cross-browser functionality.
navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

if (navigator.getUserMedia) {
    permissionRQT();
} else {
    console.log("dont support "); //debug
    video.src = 'somevideo.webm'; // TODO: pitures
}

function permissionRQT() { //block undo
    navigator.getUserMedia({
        video: true, audio: false
    }, function (stream) {
        video_switch.checked = true;
        video.src = vendorURL.createObjectURL(stream);
        video.play();
    }, noPermision);
}

function startWebcam() {
    if (video_switch.checked) {
        if (video.readyState) {
            console.log("in ready gleich play");
            video.play();
        } else {
            console.log("not ready gleich permission");
            cameraTurnedOff();
        }
    } else {
        cameraTurnedOff();
    }
}

function cameraTurnedOff() {
    video.load();
    video.pause();
    canvas_context.beginPath();
    canvas_context.rect(0, 0, canvas.width, canvas.height);
    canvas_context.fillStyle = "#d5d8dc";
    canvas_context.fill();
    video_switch.checked = false;
}

video.addEventListener('ended', function () {
    cameraTurnedOff();
}, false);

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

function cameraSwap() {
    //TODO
}