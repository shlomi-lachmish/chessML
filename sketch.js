let video;
// Create a KNN classifier
const knnClassifier = ml5.KNNClassifier();
let featureExtractor;

async function setup() {
  // Create a featureExtractor that can extract the already learned features from MobileNet
  featureExtractor =  ml5.featureExtractor('MobileNet', modelReady);
  // Create a video element
  // Grab elements, create settings, etc.
  video = document.getElementById('video');

  // Create a webcam capture
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true
  });
  video.srcObject = stream;
  video.play();
  // Create the UI buttons
  createButtons();
}

setup();

function modelReady() {
  // console.log(featureExtractor)
  document.querySelector('#status').textContent = 'FeatureExtractor(mobileNet model) Loaded';
}

// Add the current frame from the video to the classifier
function addExample(label) {
  // Get the features of the input video
  const features = featureExtractor.infer(video);
  // You can also pass in an optional endpoint, defaut to 'conv_preds'
  // const features = featureExtractor.infer(video, 'conv_preds');
  // You can list all the endpoints by calling the following function
  // console.log('All endpoints: ', featureExtractor.mobilenet.endpoints)

  // Add an example with a label to the classifier
  knnClassifier.addExample(features, label);
  updateCounts();
}

// Predict the current frame.
function classify() {
  // Get the total number of labels from knnClassifier
  const numLabels = knnClassifier.getNumLabels();
  if (numLabels <= 0) {
    console.error('There is no examples in any label');
    return;
  }
  // Get the features of the input video
  const features = featureExtractor.infer(video);

  // Use knnClassifier to classify which label do these features belong to
  // You can pass in a callback function `gotResults` to knnClassifier.classify function
  knnClassifier.classify(features, gotResults);
  // You can also pass in an optional K value, K default to 3
  // knnClassifier.classify(features, 3, gotResults);

  // You can also use the following async/await function to call knnClassifier.classify
  // Remember to add `async` before `function predictClass()`
  // const res = await knnClassifier.classify(features);
  // gotResults(null, res);
}

// A util function to create UI buttons
function createButtons() {
  // When the A button is pressed, add the current frame
  // from the video with a label of "rock" to the classifier
  buttonA = document.querySelector('#example1');
  buttonA.addEventListener('click', function () {
    addExample('Row1');
  });

  // When the B button is pressed, add the current frame
  // from the video with a label of "paper" to the classifier
   buttonB = document.querySelector('#example2');
   buttonB.addEventListener('click', function () {
     addExample('Row2');
   });
   buttonC = document.querySelector('#example3');
   buttonC.addEventListener('click', function () {
     addExample('Row3');
   });
   buttonD = document.querySelector('#example4');
   buttonD.addEventListener('click', function () {
     addExample('Row4');
   });
   buttonE = document.querySelector('#example5');
   buttonE.addEventListener('click', function () {
     addExample('Row5');
   });
   buttonF = document.querySelector('#example6');
   buttonF.addEventListener('click', function () {
     addExample('Row6');
   });
   buttonG = document.querySelector('#example7');
   buttonG.addEventListener('click', function () {
     addExample('Row7');
   });
   buttonH = document.querySelector('#example8');
   buttonH.addEventListener('click', function () {
     addExample('Row8');
   });

  // // When the C button is pressed, add the current frame
  // // from the video with a label of "scissor" to the classifier
  // buttonC = document.querySelector('#addClassScissor');
  // buttonC.addEventListener('click', function () {
  //   addExample('Scissor');
  // });

  // Reset buttons
   resetBtnA = document.querySelector('#reset1');
   resetBtnA.addEventListener('click', function () {
     clearLabel('Row1');
   });

   resetBtnB = document.querySelector('#reset2');
   resetBtnB.addEventListener('click', function () {
     clearLabel('Row2');
   });
   resetBtnC = document.querySelector('#reset3');
   resetBtnC.addEventListener('click', function () {
     clearLabel('Row3');
   });

   resetBtnD = document.querySelector('#reset4');
   resetBtnD.addEventListener('click', function () {
     clearLabel('Row4');
   });
   resetBtnE = document.querySelector('#reset5');
   resetBtnE.addEventListener('click', function () {
     clearLabel('Row5');
   });

   resetBtnF = document.querySelector('#reset6');
   resetBtnF.addEventListener('click', function () {
     clearLabel('Row6');
   });
   resetBtnG = document.querySelector('#reset7');
   resetBtnG.addEventListener('click', function () {
     clearLabel('Row7');
   });

   resetBtnH = document.querySelector('#reset8');
   resetBtnH.addEventListener('click', function () {
     clearLabel('Row8');
   });

  // resetBtnC = document.querySelector('#resetScissor');
  // resetBtnC.addEventListener('click', function () {
  //   clearLabel('Scissor');
  // });

  // Predict button
  buttonPredict = document.querySelector('#buttonPredict');
  buttonPredict.addEventListener('click', classify);

  // Clear all classes button
  buttonClearAll = document.querySelector('#clearAll');
  buttonClearAll.addEventListener('click', clearAllLabels);

  // Load saved classifier dataset
  buttonSetData = document.querySelector('#load');
  buttonSetData.addEventListener('click', loadMyKNN);

  // Get classifier dataset
  buttonGetData = document.querySelector('#save');
  buttonGetData.addEventListener('click', saveMyKNN);
}

// Show the results
function gotResults(err, result) {
  // Display any error
  if (err) {
    console.error(err);
  }

  if (result.confidencesByLabel) {
    const confidences = result.confidencesByLabel;
    // result.label is the label that has the highest confidence
    if (result.label) {
      document.querySelector('#result').textContent = result.label;
      document.querySelector('#confidence').textContent = `${confidences[result.label] * 100} %`;
    }

    document.querySelector('#confidence1').textContent = `${confidences.Row1 ? confidences.Row1 * 100 : 0} %`;
    document.querySelector('#confidence2').textContent = `${confidences.Row2 ? confidences.Row2 * 100 : 0} %`;
    document.querySelector('#confidence3').textContent = `${confidences.Row3 ? confidences.Row3 * 100 : 0} %`;
    document.querySelector('#confidence4').textContent = `${confidences.Row4 ? confidences.Row4 * 100 : 0} %`;
    document.querySelector('#confidence5').textContent = `${confidences.Row5 ? confidences.Row5 * 100 : 0} %`;
    document.querySelector('#confidence6').textContent = `${confidences.Row6 ? confidences.Row6 * 100 : 0} %`;
    document.querySelector('#confidence7').textContent = `${confidences.Row7 ? confidences.Row7 * 100 : 0} %`;
    document.querySelector('#confidence8').textContent = `${confidences.Row8 ? confidences.Row8 * 100 : 0} %`;
  }

  classify();
}

// Update the example count for each label	
function updateCounts() {
  const counts = knnClassifier.getCountByLabel();

  document.querySelector('#counter1').textContent = counts.Row1 || 0;
  document.querySelector('#counter2').textContent = counts.Row2 || 0;
  document.querySelector('#counter3').textContent = counts.Row3 || 0;
  document.querySelector('#counter4').textContent = counts.Row4 || 0;
  document.querySelector('#counter5').textContent = counts.Row5 || 0;
  document.querySelector('#counter6').textContent = counts.Row6 || 0;
  document.querySelector('#counter7').textContent = counts.Row7 || 0;
  document.querySelector('#counter8').textContent = counts.Row8 || 0;
  // document.querySelector('#exampleScissor').textContent = counts.Scissor || 0;
}

// Clear the examples in one label
function clearLabel(label) {
  knnClassifier.clearLabel(label);
  updateCounts();
}

// Clear all the examples in all labels
function clearAllLabels() {
  knnClassifier.clearAllLabels();
  updateCounts();
}

// Save dataset as myKNNDataset.json
function saveMyKNN() {
  knnClassifier.save('myKNNDataset');
}

// Load dataset to the classifier
function loadMyKNN() {
  knnClassifier.load('./myKNNDataset.json', updateCounts);
}

function sayHi(){
  console.log("hi3")
}