var priceReg = /\$\d*\.?\d{2,}/g;
var quantReg = /\d*\.?\d+ *[kK][wW][hH]/g;
var unitPrice = 0.21

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
	context.drawImage(cameraView, 0, 0)
	setTimeout(function() {
		drawFrame()
		}, 1000/30)
}

function processText(rawText) {
	//Just retrieves and reports based on largest price/quantity for now
	highCost = 0
	largeQuantity = 0
	hasPrice = false
	hasQuantity = false
	
	matchText = rawText
	match = priceReg.exec(matchText)
	while (match) {
		hasPrice = true
		val = match[0].substring(1)
		//alert(match[0] + " : " + val)
		if (val > highCost) {
			highCost = val
			//alert(highCost)
		}
		match = priceReg.exec(matchText)
	}
	
	matchText = rawText
	match = quantReg.exec(matchText)
	while (match) {
		hasQuantity = true
		val = match[0].substring(0, match[0].indexOf(' '))
		//alert(match[0] + " : " + val)
		if (val > largeQuantity) {
			largeQuantity = val
			//alert(largeQuantity)
		}
		match = quantReg.exec(matchText)
	}
	
	if (hasQuantity) {
		ourPowerCost = Math.round(unitPrice * largeQuantity * 100) / 100
		difference = highCost - ourPowerCost
		opCostString = ourPowerCost.toFixed(2)
		diffString = difference.toFixed(2)
		if (hasPrice) {
			alert("We think you used " + largeQuantity + " kWh, which cost you $" + highCost)
			alert("With OurPower, this bill would have been $" + opCostString + ", a difference of $" + diffString)
		} else {
			alert("We couldn't see a total bill, but we think you used " + largeQuantity + " kWh in this bill")
			alert("With OurPower, this bill would have been $" + opCostString)
		}
	} else { 
		alert("We couldn't see the info we needed")
	}
}
// Take a picture when cameraTrigger is tapped
cameraTrigger.onclick = function() {
    cameraSensor.width = cameraView.videoWidth
    cameraSensor.height = cameraView.videoHeight
    cameraSensor.getContext("2d").drawImage(cameraView, 0, 0)
    cameraOutput.src = cameraSensor.toDataURL("image/webp")
    cameraOutput.classList.add("taken")
	cameraTrigger.disabled = true
	cameraTrigger.innerHTML = "Processing..."
	Tesseract.recognize(cameraSensor.getContext("2d"))
		.progress(function(message) {
		  console.log(message)
		  if (message.status == "recognizing text") {
			  cameraTrigger.innerHTML = "Processing... [" + Math.round(100 * message.progress) + "]"
		  }
		})
		.then(function(result) {
		  //alert(result.text)
		  cameraTrigger.disabled = false
		  cameraTrigger.innerHTML = "Process"
		  processText(result.text)
		})
		.catch(function(err) {
		  console.error(err)
		  cameraTrigger.innerHTML = "Error!"
		});
};
// Start the video stream when the window loads
window.addEventListener("load", cameraStart, false);

// Annyang init/setup
var commands = {
	'show me *words': alertText
}

var alertText = function(words) {
	alert(words)
}

if (annyang) {
	annyang.addCommands(commands)
	annyang.start()
} else {
	alert("Annyang missing")
}

alert("V 0.1")

