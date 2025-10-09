import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { createShaderMaterials } from "./utils/materials.js";
import { loadLogo } from "./utils/gltfLoader.js";
import { floatingAnimation, lettersMouseFollow } from "./utils/animations.js";

const $canvas = document.getElementById("webgl");
let renderer, camera, scene, controls;
let clock = new THREE.Clock();
let background, backgroundMaterial;
let lettersMaterial;
let mainMaterial;
let testMaterial;
let logoGroup, lettersGroup, logoBackgroundGroup;
const mouse = new THREE.Vector2();
const mouseShader = new THREE.Vector2();

const shaderSetup = () => {
  const materials = createShaderMaterials();

  testMaterial = materials.testMaterial;
  lettersMaterial = materials.lettersMaterial;
  backgroundMaterial = materials.backgroundMaterial;
  mainMaterial = materials.mainMaterial;
};

const lightingSetup = (scene) => {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); // Soft light
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xfff8f0, 1); // Neutral warm (~5000K)
  directionalLight.position.set(10, 10, 5);
  scene.add(directionalLight);

  const pointLight = new THREE.PointLight(0xffedd9, 0.8, 100); // Subtle warm fill (~4000K)
  pointLight.position.set(-10, -10, 10);
  scene.add(pointLight);
};

const controlsSetup = () => {
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 5;
  controls.maxDistance = 45; // sphere radius 50
};

const audioSetup = () => {
  const audio = new Audio();
  audio.src = "assets/ChariotsofFire_Soundtrack.mp3";
  audio.loop = true;
  audio.volume = 0.2;

  let isPlaying = false;

  const audioUI = document.createElement("div");
  audioUI.style.cssText = `
    position: absolute;
    bottom: 1rem;
    left: 50vw;
    transform: translateX(-50%);
    color: white;
    font-family: Arial, sans-serif;
    font-size: 1rem;
    z-index: 10;
  `;

  const updateUI = () => {
    audioUI.textContent = isPlaying
      ? "Click to pause music"
      : "Click to play music";
  };

  updateUI();

  const toggleAudio = async () => {
    try {
      if (isPlaying) {
        audio.pause();
        isPlaying = false;
      } else {
        await audio.play();
        isPlaying = true;
      }
      updateUI();
    } catch (error) {
      console.log("Audio toggle failed:", error);
    }
  };

  document.addEventListener("click", toggleAudio);
  document.body.appendChild(audioUI);

  return { audio, toggle: toggleAudio };
};

const setup = () => {
  renderer = new THREE.WebGLRenderer({
    canvas: $canvas,
    antialias: true,
  });

  shaderSetup();

  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.5,
    100
  );

  camera.position.set(0, 0, 35);

  scene = new THREE.Scene();

  loadLogo(scene, camera, lettersMaterial, mainMaterial).then((groups) => {
    logoGroup = groups.logoGroup;
    lettersGroup = groups.lettersGroup;
    logoBackgroundGroup = groups.logoBackgroundGroup;
  });

  // create background sphere (we're inside it)
  const geometry = new THREE.SphereGeometry(50, 32, 32);
  background = new THREE.Mesh(geometry, backgroundMaterial);
  scene.add(background);

  lightingSetup(scene);

  controlsSetup();

  audioSetup();
};

const init = () => {
  console.log("init");

  setup();

  window.addEventListener("resize", resize);
  resize();

  window.addEventListener("mousemove", (e) => {
    mouseShader.x = e.clientX;
    mouseShader.y = e.clientY;

    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  requestAnimationFrame(draw);
};

const materialUniformsUpdate = (elapsedTime) => {
  // Update background material uniforms (ShaderMaterial)
  backgroundMaterial.uniforms.iTime.value = elapsedTime;
  backgroundMaterial.uniforms.iMouse.value.x = mouseShader.x;
  backgroundMaterial.uniforms.iMouse.value.y = mouseShader.y;
  backgroundMaterial.uniforms.lightInfluence.value = 0.5;
  backgroundMaterial.uniforms.ambientLightIntensity.value = 0.3;

  // Update test material uniforms (ShaderMaterial)
  testMaterial.uniforms.iTime.value = elapsedTime;
  testMaterial.uniforms.iMouse.value.x = mouseShader.x;
  testMaterial.uniforms.iMouse.value.y = mouseShader.y;
};

const draw = () => {
  const elapsedTime = clock.getElapsedTime();

  floatingAnimation(elapsedTime, logoGroup);
  lettersMouseFollow(lettersGroup, mouse);
  materialUniformsUpdate(elapsedTime);

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(draw);
};

const resize = () => {
  renderer.setSize(
    window.innerWidth * window.devicePixelRatio,
    window.innerHeight * window.devicePixelRatio,
    false
  );
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
};

init();
