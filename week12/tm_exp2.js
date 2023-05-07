let webcam, labelContainer, detector;

// ініціалізація
async function init() {
const model = handpose.SupportedModels.mediapipeHands;
const detectorConfig = {
runtime: "mediapipe",
solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/hands",
modelType: "lite",
};
detector = await handpose.createDetector(model, detectorConfig);

// налаштування вебкамери
const flip = true;
webcam = new tmImage.Webcam(400, 400, flip);
await webcam.setup();
await webcam.play();
window.requestAnimationFrame(loop);

// додавання вебкамери до DOM
document.getElementById("webcam-container").appendChild(webcam.canvas);
labelContainer = document.getElementById("label-container");

    if (predictions.length == 0) {
        labelContainer.innerHTML = "Не виявлено руки";
    } else {
        const landmarks = predictions[0].landmarks;

        if (predictions[0].handInViewConfidence < 0.5) {
            labelContainer.innerHTML = "Рука не повністю в області видимості";
        } else {
            const fingers = [                [0, 1, 2, 3], // вказівний палець
                [0, 5, 6, 7], // середній палець
                [0, 9, 10, 11], // безіменний палець
                [0, 13, 14, 15], // мізинець
                [0, 17, 18, 19], // великий палець
            ];

            for (let finger of fingers) {
                const [x1, y1, z1] = landmarks[finger[0]];
                const [x2, y2, z2] = landmarks[finger[1]];
                const [x3, y3, z3] = landmarks[finger[2]];
                const [x4, y4, z4] = landmarks[finger[3]];

                // обчислення довжини пальця
                const length = Math.sqrt(
                    (x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2
                );

                // обчислення векторів
                const v1 = [x2 - x1, y2 - y1, z2 - z1];
                const v2 = [x4 - x3, y4 - y3, z4 - z3];

                // обчислення скалярного добутку та кута мі
}
	}
// основний цикл
async function loop() {
webcam.update();
await predict();
window.requestAnimationFrame(loop);
}

const skipCount = 5;
let frameCount = 0;

// функція передбачення
async function predict() {
if (frameCount % skipCount == 0) {
const predictions = await detector.estimateHands(webcam.canvas);
	    if (predictions.length == 0) {
        labelContainer.innerHTML = "Не виявлено руки";
    } else {
        const landmarks = predictions[0].landmarks;

        if (predictions[0].handInViewConfidence < 0.5) {
            labelContainer.innerHTML = "Рука не повністю в області видимості";
        } else {
            const fingers = [                [0, 1, 2, 3], // вказівний палець
                [0, 5, 6, 7], // середній палець
                [0, 9, 10, 11], // безіменний палець
                [0, 13, 14, 15], // мізинець
                [0, 17, 18, 19], // великий палець
            ];

            for (let finger of fingers) {
                const [x1, y1, z1] = landmarks[finger[0]];
                const [x2, y2, z2] = landmarks[finger[1]];
                const [x3, y3, z3] = landmarks[finger[2]];
                const [x4, y4, z4] = landmarks[finger[3]];

                // обчислення довжини пальця
                const length = Math.sqrt(
                    (x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2
                );

                // обчислення векторів
                const v1 = [x2 - x1, y2 - y1, z2 - z1];
                const v2 = [x4 - x3, y4 - y3, z4 - z3];
// обчислення скалярного добутку та кута між пальцями руки
const fingerNames = ["thumb", "indexFinger", "middleFinger", "ringFinger", "pinky"];
const fingers = fingerNames.map(name => hands[0].keypoints.find(point => point.name === name));
const angles = [];

for (let i = 0; i < fingers.length; i++) {
    for (let j = i + 1; j < fingers.length; j++) {
        const finger1 = fingers[i];
        const finger2 = fingers[j];
        const vector1 = [finger1.x - finger1.width/2, finger1.y - finger1.height/2];
        const vector2 = [finger2.x - finger2.width/2, finger2.y - finger2.height/2];
        const dotProduct = vector1[0] * vector2[0] + vector1[1] * vector2[1];
        const magnitude1 = Math.sqrt(vector1[0] ** 2 + vector1[1] ** 2);
        const magnitude2 = Math.sqrt(vector2[0] ** 2 + vector2[1] ** 2);
        const angle = Math.acos(dotProduct / (magnitude1 * magnitude2)) * 180 / Math.PI;
        angles.push(angle);
    }
}

// виведення результатів
let output = "Кути між пальцями: ";
for (let i = 0; i < angles.length; i++) {
    output += fingerNames[i] + " vs ";
    for (let j = i + 1; j < angles.length; j++) {
        output += fingerNames[j] + ": " + angles[i * (angles.length - 1) - (i - 1) * i / 2 + j - i - 1].toFixed(2) + "°";
        if (j < angles.length - 1) {
            output += ", ";
        }
    }
    if (i < angles.length - 1) {
        output += " | ";
    }
}
labelContainer.innerHTML = output;



