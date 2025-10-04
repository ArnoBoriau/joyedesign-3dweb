// https://www.shadertoy.com/view/XsVSDz
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import mainBufferShader from "./shaders/main/buffer.glsl?raw";
import mainFragmentShader from "./shaders/main/fragment.glsl?raw";
import mainVertexShader from "./shaders/main/vertex.glsl?raw";

const $canvas = document.getElementById("webgl");
let renderer, camera, scene, controls;
let clock = new THREE.Clock();
let plane, material;
let renderTarget, rtScene, rtCamera, rtMaterial;
const mouse = new THREE.Vector2();

const init = () => {
  console.log("init");

  renderer = new THREE.WebGLRenderer({
    canvas: $canvas,
    antialias: true,
  });

  // shader renderer
  const effectPlaneGeometry = new THREE.PlaneGeometry(2, 2);
  rtMaterial = new THREE.ShaderMaterial({
    uniforms: {
      iTime: { value: 0 },
      iMouse: { value: new THREE.Vector4(0, 0, 0, 0) },
      iResolution: {
        value: new THREE.Vector2(512, 512),
      },
    },
    vertexShader: mainVertexShader,
    fragmentShader: mainBufferShader,
  });
  const effectPlane = new THREE.Mesh(effectPlaneGeometry, rtMaterial);
  rtCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  rtScene = new THREE.Scene();
  rtScene.add(effectPlane);
  renderTarget = new THREE.WebGLRenderTarget(1024, 1024, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
  });
  // end shader renderer

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
          child.material = rtMaterial;
        } else {
          child.material = material;
        }
      });
      gltf.scene.position.z = 2;
      gltf.scene.rotation.x = Math.PI / 2;
      scene.add(gltf.scene);
    }
  );

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  const geometry = new THREE.PlaneGeometry(25, 25);
  material = new THREE.ShaderMaterial({
    uniforms: {
      iTime: { value: 0 },
      iResolution: {
        value: new THREE.Vector2(512, 512),
      },
      iMouse: { value: new THREE.Vector2(0, 0) },
      iChannel0: { value: renderTarget.texture },
    },
    vertexShader: mainVertexShader,
    fragmentShader: mainFragmentShader,
  });
  plane = new THREE.Mesh(geometry, material);
  scene.add(plane);

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

  rtMaterial.uniforms.iTime.value = elapsedTime;
  rtMaterial.uniforms.iMouse.value.x = mouse.x;
  rtMaterial.uniforms.iMouse.value.y = mouse.y;
  material.uniforms.iTime.value = elapsedTime * 2;
  material.uniforms.iMouse.value.x = mouse.x;
  material.uniforms.iMouse.value.y = mouse.y;

  renderer.setRenderTarget(renderTarget);
  renderer.render(rtScene, rtCamera);
  renderer.setRenderTarget(null);

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
