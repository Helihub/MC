// Reference to video element.
var video = document.getElementById('video'),
    canvas = document.getElementById('canvas'),
    canvas_context = canvas.getContext('2d'),
    vendorURL = window.URL || window.webkitURL,
    video_switch = document.getElementById('permission_switch'),
    defaultImage = document.getElementById('defauldImg'),
    myTimeout,
    mode = "yb";

var noPermision = function (e) {
    // User rejected camera request. Handle appropriately.
    cameraTurnedOff();
    console.log("error bei error callback: " + e.message); //TODO explain permission issues 
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
    draw(defaultImage, canvas_context, canvas.width, canvas.height);
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
    video.style.display = 'none';
    draw(defaultImage, canvas_context, canvas.width, canvas.height);
    clearTimeout(myTimeout);
    video_switch.checked = false;
}

$('.list-group-item').on('click', function () {
    mode = $(this).attr('value');
})

$('.btn-secondary').on('click', function () {
    mode = $(this).attr('id');
})

video.addEventListener('ended', function () {
    cameraTurnedOff();
}, false);

video.addEventListener('play', function () {
    clearTimeout(myTimeout);
    draw(this, canvas_context, canvas.width, canvas.height);
}, false);

function draw(video, context, width, height) {
    var data, brightness;

    context.drawImage(video, 0, 0, width, height);
    image = context.getImageData(0, 0, width, height);
    data = image.data;

    switch (mode) {
        case "yb":
            modifyColorSpectrum(data, 0, 1);
            break;
        case "cr":
            modifyColorSpectrum(data, 1, 2);
            break;
        case "mg":
            modifyColorSpectrum(data, 0, 2);
            break;
        case "bw":
            var i, r, g, b;
            for (i = 0; i < data.length; i = i + 4) {
                r = data[i];
                g = data[i + 1];
                b = data[i + 2];
                data[i] = data[i + 1] = data[i + 2] = (r + g + b) / 3;
            }
            break;
        default:
            break;
    }

    image.data = data;
    context.putImageData(image, 0, 0);
    myTimeout = setTimeout(draw, 20, video, context, width, height);
}

function modifyColorSpectrum(data, firstChannel, secondChannel) {
    var i, firstHue, secondHue;
    for (i = 0; i < data.length; i = i + 4) {
        firstHue = data[i + firstChannel];
        secondHue = data[i + secondChannel];
        data[i + firstChannel] = data[i + secondChannel] = (firstHue + secondHue) / 2;
    }
}

function cameraSwap() {
    //TODO
}