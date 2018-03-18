import video from './video';
import animate from './render-video';
import visualize, { audioCtx, analyser } from './sound';

navigator.mediaDevices.getUserMedia({ audio: true, video: true })
  .then((mediaStream) => {
    video.srcObject = mediaStream;
    const source = audioCtx.createMediaStreamSource(mediaStream);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    visualize();
  })
  .catch((err) => { console.log(`${err.name}: ${err.message}`); }); // eslint-disable-line

animate();
