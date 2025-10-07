// https://www.shadertoy.com/view/XsVSDz
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import mainFragmentShader from "./shaders/main/fragment.glsl?raw";
import mainVertexShader from "./shaders/main/vertex.glsl?raw";

import lettersFragmentShader from "./shaders/letters-shader/fragment.glsl?raw";
import lettersVertexShader from "./shaders/letters-shader/vertex.glsl?raw";

const $canvas = document.getElementById("webgl");
let renderer, camera, scene, controls;
let clock = new THREE.Clock();
let plane, material;
let lettersMaterial;
const mouse = new THREE.Vector2();

const init = () => {
  console.log("init");

  renderer = new THREE.WebGLRenderer({
    canvas: $canvas,
    antialias: true,
  });

  // letters shader material
  lettersMaterial = new THREE.ShaderMaterial({
    uniforms: {
      iTime: { value: 0 },
      iMouse: { value: new THREE.Vector2(0, 0) },
      iResolution: {
        value: new THREE.Vector2(512, 512),
      },
    },
    vertexShader: lettersVertexShader,
    fragmentShader: lettersFragmentShader,
  });

  // background plane shader material
  material = new THREE.ShaderMaterial({
    uniforms: {
      iTime: { value: 0 },
      iResolution: {
        value: new THREE.Vector2(512, 512),
      },
      iMouse: { value: new THREE.Vector2(0, 0) },
    },
    vertexShader: mainVertexShader,
    fragmentShader: mainFragmentShader,
  });

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
        } else {
          child.material = material;
        }
      });
      gltf.scene.position.z = 2;
      gltf.scene.rotation.x = Math.PI / 2;
      scene.add(gltf.scene);
    }
  );

  // create background plane
  const geometry = new THREE.PlaneGeometry(25, 25);
  plane = new THREE.Mesh(geometry, material);
  scene.add(plane);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  window.addEventListener("resize", resize);
  resize();

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  requestAnimationFrame(draw);
};

const draw = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update letters shader uniforms
  lettersMaterial.uniforms.iTime.value = elapsedTime;
  lettersMaterial.uniforms.iMouse.value.x = mouse.x;
  lettersMaterial.uniforms.iMouse.value.y = mouse.y;

  // Update background material uniforms
  material.uniforms.iTime.value = elapsedTime * 2;
  material.uniforms.iMouse.value.x = mouse.x;
  material.uniforms.iMouse.value.y = mouse.y;

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
