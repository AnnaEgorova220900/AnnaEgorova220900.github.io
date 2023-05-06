 let webcam, labelContainer, detector;

init();

// Load the image model and setup the webcam
async function init() {
    const model = handPoseDetection.SupportedModels.MediaPipeHands;
    const detectorConfig = {
        runtime: 'mediapipe',
        solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands',
        modelType: 'lite'
    }
    detector = await handPoseDetection.createDetector(model, detectorConfig);

    // Convenience function to setup a webcam
    const flip = true;
    webcam = new tmImage.Webcam(400, 400, flip);
    await webcam.setup();
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

        if(hands.length == 0)
            labelContainer.innerHTML = "Не бачу рук";
        else
        {
            const fingerTips = hands[0].annotations.indexFinger
                .concat(hands[0].annotations.middleFinger)
                .concat(hands[0].annotations.ringFinger)
                .concat(hands[0].annotations.pinky)
                .map(point => [point[0], point[1], 0]);

            // calculate the length of each finger
            const fingerLengths = [];
            fingerLengths.push(distance(fingerTips[0], fingerTips[3]));
            fingerLengths.push(distance(fingerTips[3], fingerTips[6]));
            fingerLengths.push(distance(fingerTips[6], fingerTips[9]));
            fingerLengths.push(distance(fingerTips[9], fingerTips[12]));
            fingerLengths.push(distance(fingerTips[12], fingerTips[15]));

            // calculate the angle between each adjacent finger
            const fingerAngles = [];
            fingerAngles.push(angle(fingerTips[0], fingerTips[3], fingerTips[6]));
            fingerAngles.push(angle(fingerTips[3], fingerTips[6], fingerTips[9]));
            fingerAngles.push(angle(fingerTips[6], fingerTips[9], fingerTips[12]));
            fingerAngles.push(angle(fingerTips[9], fingerTips[12], fingerTips[15]));

            // display the finger angles
            labelContainer.innerHTML = "";
            for(let i=0;i<fingerAngles.length;i++)
                labelContainer.innerHTML += "Angle " + (i+1) + ": " + Math.round(fingerAngles[i]) + "°<br>";
        }
    }

    frameCount++;
}

// calculate the distance between two points
function distance(p1, p2) {
    const dx = p2[0] - p1[0];
    const dy = p2[1] - p1[1];
    return Math.sqrt(dx*dx + dy*dy);
}

// calculate the angle between three points
function angle(p1, p2, p3) {
    const v1 = [p2[0] - p1[0], p2[1] - p1[1], 0];
    const v2 = [p3[0] - p2[0], p3[1] - p2[1], 0];
    const dotProduct = v1[0]*v2[0] + v1[1]*v2[1] + v1[2]*v2[2];
    const magV1 = Math.sqrt(v1[0]*v1[0] + v1[1]*v1[1] + v1[2]*v1[2]);
    const magV2 = Math.sqrt(v2[0]*v2[0] + v2[1]*v2[1] + v2[2]*v2[2]);
    const cosTheta = dotProduct / (magV1 * magV2);
    const theta = Math.acos(cosTheta) * (180/Math.PI);
    return theta;
}

// calculate the finger angles and display them
function calculateFingerAngles(keypoints) {
    const fingerTips = [
        keypoints[8].position, // thumb tip
        keypoints[12].position, // index finger tip
        keypoints[16].position, // middle finger tip
        keypoints[20].position, // ring finger tip
        keypoints[24].position // pinky finger tip
    ];
    const fingerMCPs = [
        keypoints[6].position, // thumb MCP
        keypoints[10].position, // index finger MCP
        keypoints[14].position, // middle finger MCP
        keypoints[18].position, // ring finger MCP
        keypoints[22].position // pinky finger MCP
    ];

    let fingerAngles = [];
    for (let i = 0; i < fingerTips.length; i++) {
        const tip = fingerTips[i];
        const mcp = fingerMCPs[i];
        const dip = keypoints[i*4 + 10].position; // finger DIP
        const pip = keypoints[i*4 + 9].position; // finger PIP

        const fingerLength = distance(mcp, tip);
        const fingerMCPtoPIP = distance(mcp, pip);
        const fingerPIPtodip = distance(pip, dip);

        const angle1 = angle(mcp, pip, dip);
        const angle2 = angle(pip, dip, tip);

        let fingerAngle = 180 - angle1 - angle2;
        if (fingerAngle < 0) {
            fingerAngle = 360 - fingerAngle;
        }
        fingerAngles.push(fingerAngle);
    }

    labelContainer.innerHTML = '';
    for (let i = 0; i < fingerAngles.length; i++) {
        labelContainer.innerHTML += 'Angle ' + (i+1) + ': ' + fingerAngles[i].toFixed(2) + ' degrees<br>';
    }
}

