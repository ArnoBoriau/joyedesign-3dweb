import * as THREE from "three";
import { gsap } from "gsap";

import { lightingSetup } from "./setup/lightingSetup.js";
import { controlsSetup } from "./setup/controlsSetup.js";
import { audioSetup } from "./setup/audioSetup.js";
import { blenderLoader } from "./setup/blenderSetup.js";

import { createShaderMaterials } from "./utils/materials.js";
import {
  floatingAnimation,
  lettersMouseFollow,
  clickEffect,
} from "./utils/animations.js";
import { materialUniformsUpdate } from "./utils/materialUpdates.js";

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

  blenderLoader(scene, camera, lettersMaterial, mainMaterial).then((groups) => {
    logoGroup = groups.logoGroup;
    lettersGroup = groups.lettersGroup;
    logoBackgroundGroup = groups.logoBackgroundGroup;
  });

  // create background sphere (we're inside it)
  const geometry = new THREE.SphereGeometry(50, 32, 32);
  background = new THREE.Mesh(geometry, backgroundMaterial);
  scene.add(background);

  lightingSetup(scene);

  controls = controlsSetup(camera, renderer);

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

  window.addEventListener("click", (e) => {
    clickEffect(logoGroup, camera);
  });

  requestAnimationFrame(draw);
};

const draw = () => {
  const elapsedTime = clock.getElapsedTime();

  floatingAnimation(elapsedTime, logoGroup);
  lettersMouseFollow(lettersGroup, mouse);
  materialUniformsUpdate(
    elapsedTime,
    backgroundMaterial,
    testMaterial,
    mouseShader
  );

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
