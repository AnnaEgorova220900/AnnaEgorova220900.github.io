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
			if(hands[0].handedness == "Left")
				labelContainer.innerHTML = "Бачу ліву руку<br><br>";
			else
				labelContainer.innerHTML = "Бачу праву руку<br><br>";

			const fingerLookupIndices = {
				thumb: [0, 1, 2, 3, 4],
				indexFinger: [0, 5, 6, 7, 8],
				middleFinger: [0, 9, 10, 11, 12],
				ringFinger: [0, 13, 14, 15, 16],
				pinky: [0, 17, 18, 19, 20],
			};

			const fingers = Object.keys(fingerLookupIndices);

			for (let j = 0; j < fingerLookupTable.length; j++) {
  for (let k = j + 1; k < fingerLookupTable.length; k++) {
    let finger1 = fingerLookupTable[j][0];
    let finger2 = fingerLookupTable[k][0];
    let vector1 = [      hands[0].keypoints[hands[0].annotations[finger1].jointIndexes[0]].x - hands[0].keypoints[hands[0].annotations[finger1].jointIndexes[1]].x,
      hands[0].keypoints[hands[0].annotations[finger1].jointIndexes[0]].y - hands[0].keypoints[hands[0].annotations[finger1].jointIndexes[1]].y,
      hands[0].keypoints[hands[0].annotations[finger1].jointIndexes[0]].z - hands[0].keypoints[hands[0].annotations[finger1].jointIndexes[1]].z
    ];
    let vector2 = [      hands[0].keypoints[hands[0].annotations[finger2].jointIndexes[0]].x - hands[0].keypoints[hands[0].annotations[finger2].jointIndexes[1]].x,
      hands[0].keypoints[hands[0].annotations[finger2].jointIndexes[0]].y - hands[0].keypoints[hands[0].annotations[finger2].jointIndexes[1]].y,
      hands[0].keypoints[hands[0].annotations[finger2].jointIndexes[0]].z - hands[0].keypoints[hands[0].annotations[finger2].jointIndexes[1]].z
    ];
    let degrees = angleBetweenVectors(vector1, vector2);
    labelContainer.innerHTML += `${finger1} та ${finger2}: ${degrees.toFixed(2)} градусів<br>`;
  }
}

		}
	}

	frameCount++;
}




