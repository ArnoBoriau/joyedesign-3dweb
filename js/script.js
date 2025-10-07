import * as THREE from "three";

import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { createShaderMaterials } from "./utils/materials.js";

const $canvas = document.getElementById("webgl");
let renderer, camera, scene, controls;
let clock = new THREE.Clock();
let background, backgroundMaterial;
let lettersMaterial;
let mainMaterial;
let testMaterial;
const mouse = new THREE.Vector2();

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

const init = () => {
  console.log("init");

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
  camera.position.set(0, 0, 12.5);

  scene = new THREE.Scene();

  // Blender loader
  const loader = new GLTFLoader();
  loader.load(
    // resource URL
    "assets/logo_joyedesign.glb",
    // called when the resource is loaded
    (gltf) => {
      gltf.scene.traverse((child) => {
        if (child.name === "J-letter" || child.name === "D-letter") {
          child.material = lettersMaterial;
          // child.material = testMaterial;
        } else {
          child.material = mainMaterial;
          // child.material = testMaterial;
        }
      });
      // gltf.scene.position.z = 2;
      gltf.scene.rotation.x = Math.PI / 2;
      scene.add(gltf.scene);
    }
  );

  // create background sphere (we're inside it)
  const geometry = new THREE.SphereGeometry(50, 32, 32);
  background = new THREE.Mesh(geometry, backgroundMaterial);
  scene.add(background);

  lightingSetup(scene);

  controlsSetup();

  window.addEventListener("resize", resize);
  resize();

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  requestAnimationFrame(draw);
};

const materialUniformsUpdate = (elapsedTime) => {
  // Update background material uniforms (ShaderMaterial)
  backgroundMaterial.uniforms.iTime.value = elapsedTime;
  backgroundMaterial.uniforms.iMouse.value.x = mouse.x;
  backgroundMaterial.uniforms.iMouse.value.y = mouse.y;
  backgroundMaterial.uniforms.lightInfluence.value = 0.5;
  backgroundMaterial.uniforms.ambientLightIntensity.value = 0.3;

  // Update test material uniforms (ShaderMaterial)
  testMaterial.uniforms.iTime.value = elapsedTime;
  testMaterial.uniforms.iMouse.value.x = mouse.x;
  testMaterial.uniforms.iMouse.value.y = mouse.y;
};
const draw = () => {
  const elapsedTime = clock.getElapsedTime();

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
