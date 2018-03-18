/* global THREE */
import video from './video';

const scene = new THREE.Scene();

const width = window.innerWidth;
const height = window.innerHeight;
let time = 0;
const camera = new THREE.Camera();
camera.position.z = 1;

const texture = new THREE.VideoTexture(video);
texture.minFilter = THREE.LinearFilter;
texture.magFilter = THREE.LinearFilter;
texture.format = THREE.RGBFormat;

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.PlaneGeometry(width, height);

const material = new THREE.ShaderMaterial({
  uniforms: {
    texture: {
      type: '1i',
      value: texture,
    },
    time: {
      type: '1f',
      value: 0,
    },
  },
  vertexShader: `
    varying vec2 textureCoords;

    void main(void) {
      textureCoords = vec2((position + 1.0) * 0.5);
      gl_Position = vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D texture;
    uniform float time;
    varying vec2 textureCoords;

    float rand(vec2 co){
      return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
    }

    void main (void) {
      vec4 color = texture2D(texture, textureCoords);
      color.rgb += sin(textureCoords.x * 900.0) * 0.15;
      color.rgb += sin(textureCoords.y * 900.0) * 0.15;
      float noise2 = rand(vec2(0.6, 0.8) * sin(time * 2.0)/ 2.0);
      gl_FragColor = mix( vec4(noise2, 0.0, 0.0, 1.0), vec4(color.r, 0.0, 0.0, 1.0), 0.8);
    }
  `,
});
const plane = new THREE.Mesh(geometry, material);

scene.add(plane);
scene.add(camera);

const animate = () => {
  requestAnimationFrame(animate);
  time += 1;
  material.uniforms.time.value = time;
  renderer.render(scene, camera);
};

export default animate;
