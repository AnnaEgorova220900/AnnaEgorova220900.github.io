let webcam, labelContainer, detector;

init();

// Load the image model and setup the webcam
async function init() {

	const model = handPoseDetection.SupportedModels.MediaPipeHands;
	const detectorConfig = {
	  runtime: 'mediapipe', // or 'tfjs',
	  solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands',
	  modelType: 'lite'
	}
	detector = await handPoseDetection.createDetector(model, detectorConfig);	

	// Convenience function to setup a webcam
	const flip = true; // whether to flip the webcam
	webcam = new tmImage.Webcam(400, 400, flip); // width, height, flip
	await webcam.setup(); // request access to the webcam
	await webcam.play();
	window.requestAnimationFrame(loop);

	// append elements to the DOM
	document.getElementById("webcam-container").appendChild(webcam.canvas);
	labelContainer = document.getElementById("label-container");
}

async function loop() {
	webcam.update(); // update the webcam frame
	await predict();
	window.requestAnimationFrame(loop);
}

const skipCount = 5;
let frameCount = 0;

// run the webcam image through the image model
async function predict() {
	if(frameCount % skipCount == 0)
	{
		const hands = await detector.estimateHands(webcam.canvas);
		//console.log(hands);

		if(hands.length == 0)
			labelContainer.innerHTML = "Не бачу рук";
		else
		{
			const hand = hands[0];
			const landmarks = hand.landmarks;

			// calculate finger lengths
			const fingerLengths = [				distance(landmarks[5], landmarks[9]), // thumb
				distance(landmarks[9], landmarks[13]), // index
				distance(landmarks[13], landmarks[17]), // middle
				distance(landmarks[17], landmarks[21]), // ring
				distance(landmarks[21], landmarks[25]) // pinky
			];

			// calculate angles between fingers
			const angles = [				angle(landmarks[0], landmarks[1], landmarks[2]), // thumb
				angle(landmarks[5], landmarks[6], landmarks[7]), // index
				angle(landmarks[9], landmarks[10], landmarks[11]),// middle
        distance(landmarks[14], landmarks[15]), // ring
        distance(landmarks[18], landmarks[19]) // pinky
    ];

    // output angles to label container
    let label = "";
    for (let i = 0; i < angles.length; i++) {
        label += "Angle " + (i + 1) + ": " + angles[i].toFixed(2) + " degrees<br>";
    }
    labelContainer.innerHTML = label;
}
function distance(a, b) {
    const xDiff = a.x - b.x;
    const yDiff = a.y - b.y;
    return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
}

function angle(a, b, c) {
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let degrees = radians * 180 / Math.PI;
    if (degrees < 0) {
        degrees += 360;
    }
    return degrees;
}

}
}

