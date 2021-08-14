
let model, ctx, videoWidth, videoHeight, video, canvas;
let position_check = []

let jumpState = false;
let sensitivity = 2

async function setupCamera() {
  video = document.getElementById('video');

  const stream = await navigator.mediaDevices.getUserMedia({
    'audio': false,
    'video': { facingMode: 'user', width:144, height:144 },
  });
  video.srcObject = stream;

  return new Promise((resolve) => {
    video.onloadedmetadata = () => {
      resolve(video);
    };
  });
}

const renderPrediction = async () => {

  const returnTensors = false;
  const flipHorizontal = true;
  const annotateBoxes = true;

  const predictions = await model.estimateFaces(
    video, returnTensors, flipHorizontal, annotateBoxes);

  if (predictions.length > 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < predictions.length; i++) {
      if (returnTensors) {
        predictions[i].topLeft = predictions[i].topLeft.arraySync();
        predictions[i].bottomRight = predictions[i].bottomRight.arraySync();
        if (annotateBoxes) {
          predictions[i].landmarks = predictions[i].landmarks.arraySync();
        }
      }

      const start = predictions[i].topLeft;
      const end = predictions[i].bottomRight;
      const size = [end[0] - start[0], end[1] - start[1]];
      ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
      ctx.fillRect(start[0], start[1], size[0], size[1]);

			// console.log(size,start)

			// console.clear();

			if(position_check.length === 0){
				position_check.push(predictions[0].topLeft);
			}else if(position_check.length === 1 && position_check[0] !== predictions[0].topLeft ){
				position_check.push(predictions[0].topLeft);
			}else if(position_check.length === 2 && position_check[1][0] !== predictions[0].topLeft[0]){
				position_check.shift();
				position_check.push(predictions[0].topLeft);
			}
			// console.log(position_check[0],position_check[1])
			if(position_check.length === 2){
			if(position_check[1][0]-position_check[0][0]>0){
				// console.log('You are moving RIGHT.')
			}else if(position_check[1][0]-position_check[0][0]<-5){
				
				// console.log('You are moving LEFT.')
				// if(jumpState === false){
				// 	jump();
				// 	jumpState = true;
				// }
				
			}

			if(position_check[1][1]-position_check[0][1]>0){
				console.log('You are moving Bottom.')
			}else if(position_check[1][1]-position_check[0][1]<-sensitivity){
				console.log('You are moving TOP.')
				document.getElementById('sensitivity').innerText = sensitivity;
				if(jumpState === false){
					jumpState = true;
					jump();
				}
			}

			}
			//
      if (annotateBoxes) {
        const landmarks = predictions[i].landmarks;

        ctx.fillStyle = "blue";
        for (let j = 0; j < landmarks.length; j++) {
          const x = landmarks[j][0];
          const y = landmarks[j][1];
          ctx.fillRect(x, y, 5, 5);
        }
      }
    }
  }

  requestAnimationFrame(renderPrediction);
};



const setupPage = async () => {
	await tf.setBackend('webgl');
  await setupCamera();
  video.play();

  videoWidth = video.videoWidth;
  videoHeight = video.videoHeight;
  video.width = videoWidth;
  video.height = videoHeight;

  canvas = document.getElementById('output');
  canvas.width = videoWidth;
  canvas.height = videoHeight;
  ctx = canvas.getContext('2d');
  ctx.fillStyle = "rgba(255, 0, 0, 0.5)";

  model = await blazeface.load();

  renderPrediction();
	startGame();
};

setupPage();
