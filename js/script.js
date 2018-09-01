// Reference to video element.
var video = document.getElementById('video');

var errorCallback = function (e) {
    // User rejected camera request. Handle appropriately.
};

// Ensure cross-browser functionality.
navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

if (navigator.getUserMedia) {
    navigator.getUserMedia({ video: true }, function (stream) {
        video.src = window.URL.createObjectURL(stream);
    }, errorCallback);
} else {
    video.src = 'somevideo.webm'; // fallback.
}