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
    if (frameCount % skipCount == 0) {
        const hands = await detector.estimateHands(webcam.canvas);

        if (hands.length == 0) {
            labelContainer.innerHTML = "Не бачу рук";
        } else {
            const fingerJoints = hands[0].landmarks; // get landmarks of the hand
            const fingerNames = hands[0].annotations.thumb.concat(hands[0].annotations.indexFinger, hands[0].annotations.middleFinger, hands[0].annotations.ringFinger, hands[0].annotations.pinky); // get names of the fingers

            const angles = [];
            for (let i = 0; i < fingerJoints.length; i++) {
                const [a, b, c] = fingerJoints[i]; // get three consecutive points of the finger
                const AB = [a[0] - b[0], a[1] - b[1]]; // get vector AB
                const BC = [c[0] - b[0], c[1] - b[1]]; // get vector BC
                const angle = Math.acos((AB[0] * BC[0] + AB[1] * BC[1]) / (Math.sqrt(AB[0] ** 2 + AB[1] ** 2) * Math.sqrt(BC[0] ** 2 + BC[1] ** 2))) * 180 / Math.PI; // calculate angle using scalar product formula
                angles.push(angle);
            }

            labelContainer.innerHTML = "";
            for (let i = 0; i < angles.length; i++) {
                labelContainer.innerHTML += fingerNames[i] + ": " + angles[i].toFixed(2) + "°<br>"; // display angles rounded to 2 decimal places
            }
        }
    }

    frameCount++;
}


