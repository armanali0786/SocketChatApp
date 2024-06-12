// const videoElement = document.getElementById('video');
// const outputCanvas = document.getElementById('outputCanvas');
// const ctx = outputCanvas.getContext('2d');

// const skinSmoothingSlider = document.getElementById('skinSmoothing');
// const acneRemovalSlider = document.getElementById('acneRemoval');
// const eyeBagRemovalSlider = document.getElementById('eyeBagRemoval');
// const neckSmoothingSlider = document.getElementById('neckSmoothing');
// const teethWhiteningSlider = document.getElementById('teethWhitening');


// const faceMesh = new FaceMesh({
//     locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
// });
// faceMesh.setOptions({
//     maxNumFaces: 1,
//     refineLandmarks: true,
//     minDetectionConfidence: 0.5,
//     minTrackingConfidence: 0.5
// });
// faceMesh.onResults(onResults);

// async function onResults(results) {
//     if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
//         const landmarks = results.multiFaceLandmarks[0];

//         ctx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
//         ctx.drawImage(videoElement, 0, 0, outputCanvas.width, outputCanvas.height);

//         applyFilters(ctx, landmarks);
//     }
// }

// async function startCamera() {
//     const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//     videoElement.srcObject = stream;
//     videoElement.onloadedmetadata = () => {
//         videoElement.play();
//         const camera = new Camera.Camera(videoElement, {
//             onFrame: async () => {
//                 await faceMesh.send({ image: videoElement });
//             },
//             width: 640,
//             height: 480
//         });
//         camera.start();
//     };
// }

// function applyFilters(ctx, landmarks) {
//     const skinSmoothingValue = skinSmoothingSlider.value;
//     const acneRemovalValue = acneRemovalSlider.value;
//     const eyeBagRemovalValue = eyeBagRemovalSlider.value;
//     const neckSmoothingValue = neckSmoothingSlider.value;
//     const teethWhiteningValue = teethWhiteningSlider.value;

//     // Create a temporary canvas to apply filters
//     const tempCanvas = document.createElement('canvas');
//     const tempCtx = tempCanvas.getContext('2d');
//     tempCanvas.width = outputCanvas.width;
//     tempCanvas.height = outputCanvas.height;
//     tempCtx.drawImage(outputCanvas, 0, 0);

//     const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);

//     // Skin Smoothing
//     if (skinSmoothingValue > 0) {
//         applySkinSmoothing(imageData, skinSmoothingValue);
//     }

//     // Acne Removal
//     if (acneRemovalValue > 0) {
//         applyAcneRemoval(imageData, acneRemovalValue);
//     }

//     // Eye Bag Removal
//     if (eyeBagRemovalValue > 0) {
//         applyEyeBagRemoval(imageData, landmarks, eyeBagRemovalValue);
//     }

//     // Neck Smoothing
//     if (neckSmoothingValue > 0) {
//         applyNeckSmoothing(imageData, landmarks, neckSmoothingValue);
//     }

//     // Teeth Whitening
//     if (teethWhiteningValue > 0) {
//         applyTeethWhitening(imageData, landmarks, teethWhiteningValue);
//     }

//     tempCtx.putImageData(imageData, 0, 0);
//     ctx.drawImage(tempCanvas, 0, 0);
// }

// function applySkinSmoothing(imageData, value) {
//     // Apply a basic box blur as a placeholder for skin smoothing
//     const pixels = imageData.data;
//     const width = imageData.width;
//     const height = imageData.height;

//     for (let y = 1; y < height - 1; y++) {
//         for (let x = 1; x < width - 1; x++) {
//             let r = 0, g = 0, b = 0, count = 0;
//             for (let dy = -1; dy <= 1; dy++) {
//                 for (let dx = -1; dx <= 1; dx++) {
//                     const index = ((y + dy) * width + (x + dx)) * 4;
//                     r += pixels[index];
//                     g += pixels[index + 1];
//                     b += pixels[index + 2];
//                     count++;
//                 }
//             }
//             const index = (y * width + x) * 4;
//             pixels[index] = r / count;
//             pixels[index + 1] = g / count;
//             pixels[index + 2] = b / count;
//         }
//     }
// }

// function applyAcneRemoval(imageData, value) {
//     // Implement simple acne removal by blending pixels to smooth out blemishes
//     const pixels = imageData.data;
//     const width = imageData.width;
//     const height = imageData.height;

//     for (let y = 1; y < height - 1; y++) {
//         for (let x = 1; x < width - 1; x++) {
//             const index = (y * width + x) * 4;
//             const r = pixels[index];
//             const g = pixels[index + 1];
//             const b = pixels[index + 2];

//             // Simple threshold to detect blemishes (rudimentary approach)
//             if (r > 120 && g < 100 && b < 100) {
//                 const avgR = (pixels[index - 4] + pixels[index + 4] + pixels[index - width * 4] + pixels[index + width * 4]) / 4;
//                 const avgG = (pixels[index - 3] + pixels[index + 5] + pixels[index - width * 4 + 1] + pixels[index + width * 4 + 1]) / 4;
//                 const avgB = (pixels[index - 2] + pixels[index + 6] + pixels[index - width * 4 + 2] + pixels[index + width * 4 + 2]) / 4;

//                 pixels[index] = avgR * (1 - value) + r * value;
//                 pixels[index + 1] = avgG * (1 - value) + g * value;
//                 pixels[index + 2] = avgB * (1 - value) + b * value;
//             }
//         }
//     }
// }

// function applyEyeBagRemoval(imageData, landmarks, value) {
//     // Simple lightening of the area under the eyes
//     const pixels = imageData.data;
//     const width = imageData.width;

//     const leftEye = landmarks[159];  // Example landmark for left eye
//     const rightEye = landmarks[386]; // Example landmark for right eye

//     const eyeBags = [leftEye, rightEye];

//     eyeBags.forEach(eye => {
//         const x = Math.floor(eye.x * width);
//         const y = Math.floor(eye.y * width) + 10; // Offset to area below the eyes

//         for (let dy = -10; dy <= 10; dy++) {
//             for (let dx = -20; dx <= 20; dx++) {
//                 const nx = x + dx;
//                 const ny = y + dy;
//                 if (nx >= 0 && nx < width && ny >= 0 && ny < width) {
//                     const index = (ny * width + nx) * 4;
//                     pixels[index] = Math.min(255, pixels[index] + value * 50);
//                     pixels[index + 1] = Math.min(255, pixels[index + 1] + value * 50);
//                     pixels[index + 2] = Math.min(255, pixels[index + 2] + value * 50);
//                 }
//             }
//         }
//     });
// }

// function applyNeckSmoothing(imageData, landmarks, value) {
//     // Simple smoothing for the neck area
//     const pixels = imageData.data;
//     const width = imageData.width;
//     const height = imageData.height;

//     const bottomLip = landmarks[17]; // Example landmark for bottom lip
//     const startY = Math.floor(bottomLip.y * height);

//     for (let y = startY; y < height; y++) {
//         for (let x = 0; x < width; x++) {
//             let r = 0, g = 0, b = 0, count = 0;
//             for (let dy = -1; dy <= 1; dy++) {
//                 for (let dx = -1; dx <= 1; dx++) {
//                     const ny = y + dy;
//                     const nx = x + dx;
//                     if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
//                         const index = (ny * width + nx) * 4;
//                         r += pixels[index];
//                         g += pixels[index + 1];
//                         b += pixels[index + 2];
//                         count++;
//                     }
//                 }
//             }
//             const index = (y * width + x) * 4;
//             pixels[index] = r / count * (1 - value) + pixels[index] * value;
//             pixels[index + 1] = g / count * (1 - value) + pixels[index + 1] * value;
//             pixels[index + 2] = b / count * (1 - value) + pixels[index + 2] * value;
//         }
//     }
// }

// function applyTeethWhitening(imageData, landmarks, value) {
//     // Simple teeth whitening by lightening the teeth area
//     const pixels = imageData.data;
//     const width = imageData.width;

//     const leftTeeth = landmarks[78];  // Example landmark for left teeth
//     const rightTeeth = landmarks[308]; // Example landmark for right teeth

//     const teeth = [leftTeeth, rightTeeth];

//     teeth.forEach(tooth => {
//         const x = Math.floor(tooth.x * width);
//         const y = Math.floor(tooth.y * width);

//         for (let dy = -10; dy <= 10; dy++) {
//             for (let dx = -10; dx <= 10; dx++) {
//                 const nx = x + dx;
//                 const ny = y + dy;
//                 if (nx >= 0 && nx < width && ny >= 0 && ny < width) {
//                     const index = (ny * width + nx) * 4;
//                     pixels[index] = Math.min(255, pixels[index] + value * 50);
//                     pixels[index + 1] = Math.min(255, pixels[index + 1] + value * 50);
//                     pixels[index + 2] = Math.min(255, pixels[index + 2] + value * 50);
//                 }
//             }
//         }
//     });
// }

// startCamera();
const videoElement = document.getElementById('video');
const outputCanvas = document.getElementById('outputCanvas');
const ctx = outputCanvas.getContext('2d');

const skinSmoothingSlider = document.getElementById('skinSmoothing');
const acneRemovalSlider = document.getElementById('acneRemoval');
const eyeBagRemovalSlider = document.getElementById('eyeBagRemoval');
const neckSmoothingSlider = document.getElementById('neckSmoothing');
const teethWhiteningSlider = document.getElementById('teethWhitening');

const faceMesh = new FaceMesh({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
});
faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});
faceMesh.onResults(onResults);

async function onResults(results) {
    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
        const landmarks = results.multiFaceLandmarks[0];

        ctx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
        ctx.drawImage(videoElement, 0, 0, outputCanvas.width, outputCanvas.height);

        applyFilters(ctx, landmarks);
    }
}

async function startCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoElement.srcObject = stream;
    videoElement.onloadedmetadata = () => {
        videoElement.play();
        const camera = new Camera({
            videoElement: videoElement,
            onFrame: async () => {
                await faceMesh.send({ image: videoElement });
            },
            width: 640,
            height: 480
        });
        camera.start();
    };
}

// Implement applyFilters function and other filter functions as before

startCamera();
