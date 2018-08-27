// Set constraints for the video stream
var constraints = { 
	video: 
		{ 
		facingMode: "environment",
		}, 
	audio: false 
	};
// Define constants
const cameraView = document.querySelector("#camera--view"),
    cameraOutput = document.querySelector("#camera--output"),
    cameraSensor = document.querySelector("#camera--sensor"),
    cameraTrigger = document.querySelector("#camera--trigger")
// Access the device camera and stream to cameraView
function cameraStart() {
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function(stream) {
        track = stream.getTracks()[0]
        cameraView.srcObject = stream
		drawFrame()
    })
    .catch(function(error) {
        console.error("Oops. Something is broken.", error)
    });
}

function drawFrame() {
	cameraSensor.width = cameraView.videoWidth
    cameraSensor.height = cameraView.videoHeight
	context = cameraSensor.getContext("2d")
	//context.translate(cameraView.videoWidth, 0)
	//context.scale(-1, 1)
	context.drawImage(cameraView, 0, 0)
	setTimeout(function() {
		drawFrame(); 
		}, 1000/30)
}
// Take a picture when cameraTrigger is tapped
cameraTrigger.onclick = function() {
    cameraSensor.width = cameraView.videoWidth
    cameraSensor.height = cameraView.videoHeight
    cameraSensor.getContext("2d").drawImage(cameraView, 0, 0)
    cameraOutput.src = cameraSensor.toDataURL("image/webp")
    cameraOutput.classList.add("taken")
};
// Start the video stream when the window loads
window.addEventListener("load", cameraStart, false);