const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioCtx.createAnalyser();
analyser.minDecibels = -110;
analyser.maxDecibels = -20;
analyser.smoothingTimeConstant = 0.45;

// Sound
const canvas = document.querySelector('.game__ui');
const canvasCtx = canvas.getContext('2d');
canvas.setAttribute('width', 180);
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

export default function visualize() {
  // рисуем бары
  analyser.fftSize = 128;
  const bufferLengthAlt = analyser.frequencyBinCount;
  const dataArrayAlt = new Uint8Array(bufferLengthAlt);

  canvasCtx.clearRect(0, 0, WIDTH, HEIGHT / 2);

  const drawAlt = () => {
    requestAnimationFrame(drawAlt);

    analyser.getByteFrequencyData(dataArrayAlt);

    canvasCtx.fillStyle = 'rgb(0, 0, 0)';
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT / 2);
    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT / 2);

    const barWidth = (WIDTH / bufferLengthAlt) * 1.5;
    let barHeight;
    let x = 0;

    for (let i = 0; i < bufferLengthAlt; i += 1) {
      barHeight = dataArrayAlt[i];

      canvasCtx.fillStyle = `rgb(${barHeight + 200}, 255, 255)`;
      canvasCtx.fillRect(x, (HEIGHT / 2) - (barHeight / 2), barWidth, barHeight);

      x += barWidth + 1;
    }
  };
  drawAlt();
  // рисуем волну
  analyser.fftSize = 1024;
  const bufferLength = analyser.fftSize;
  const dataArray = new Uint8Array(bufferLength);

  canvasCtx.clearRect(0, HEIGHT / 2, WIDTH, HEIGHT);

  const draw = () => {
    requestAnimationFrame(draw);

    analyser.getByteTimeDomainData(dataArray);

    canvasCtx.fillStyle = 'rgb(200, 200, 200)';
    canvasCtx.fillRect(0, HEIGHT / 2, WIDTH, HEIGHT);
    canvasCtx.clearRect(0, HEIGHT / 2, WIDTH, HEIGHT);


    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'rgb(255, 255, 255)';

    canvasCtx.beginPath();

    const sliceWidth = (WIDTH * 1.3) / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i += 1) {
      const v = dataArray[i] / 32.0;
      const y = (v * (HEIGHT / 4)) - 30;

      if (i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    canvasCtx.lineTo(canvas.width, canvas.height);
    canvasCtx.stroke();
  };
  draw();
}

export { audioCtx, analyser };
