// @ts-nocheck
import * as THREE from "three";
import { gsap } from "gsap";

import { lightingSetup } from "./setup/lightingSetup.js";
import {
  controlsSetup,
  updateCameraFromMouse,
  updateCameraLookAtFloat,
} from "./setup/controlsSetup.js";
import { audioSetup } from "./setup/audioSetup.js";
import { blenderLoader } from "./setup/blenderSetup.js";
import { setupPostProcessing } from "./setup/postProcessingSetup.js";
import {
  setupMobileControls,
  checkWebGLSupport,
  showMobilePreloadModal,
  updateTouchData,
} from "./setup/mobileSetup.js";

import { createShaderMaterials } from "./utils/materials.js";
import {
  floatingAnimation,
  lettersMouseFollow,
  clickEffect,
} from "./utils/animations.js";
import { materialUniformsUpdate } from "./utils/materialUpdates.js";
import { createSceneElements } from "./utils/sceneElements.js";

const $canvas = document.getElementById("webgl");
let renderer, camera, scene, controls;
let clock = new THREE.Clock();
let background, backgroundMaterial;
let lettersMaterial;
let mainMaterial;
let testMaterial;
let logoGroup, lettersGroup, logoBackgroundGroup;
let postProcessing;
let sceneElements = [];

const mouse = new THREE.Vector2();
const mouseShader = new THREE.Vector2();

// Mobile controls
let mobileControls = null;
let isOnMobileDevice = false;

const shaderSetup = () => {
  // Check WebGL support before setting up shaders
  const webglInfo = checkWebGLSupport();
  console.log("WebGL Info:", webglInfo);

  if (!webglInfo.supported) {
    showWebGLError(webglInfo.message);
    throw new Error("WebGL is not supported");
  }

  const materials = createShaderMaterials();

  testMaterial = materials.testMaterial;
  lettersMaterial = materials.lettersMaterial;
  backgroundMaterial = materials.backgroundMaterial;
  mainMaterial = materials.mainMaterial;
};

const showWebGLError = (message) => {
  const errorDiv = document.createElement("div");
  errorDiv.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #1a1a1a;
    color: #ff6b6b;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: monospace;
    z-index: 9999;
    padding: 20px;
    box-sizing: border-box;
  `;
  errorDiv.innerHTML = `
    <div style="text-align: center;">
      <h1>WebGL Error</h1>
      <p>${message}</p>
      <p style="font-size: 12px; margin-top: 20px; color: #aaa;">
        Your device may not support WebGL or it may be disabled in your browser settings.
      </p>
    </div>
  `;
  document.body.appendChild(errorDiv);
};

const showError = (message) => {
  const errorDiv = document.createElement("div");
  errorDiv.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #1a1a1a;
    color: #ff6b6b;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: monospace;
    z-index: 9999;
    padding: 20px;
    box-sizing: border-box;
  `;
  errorDiv.innerHTML = `
    <div style="text-align: center; max-width: 500px;">
      <h1>Error</h1>
      <p style="white-space: pre-wrap; word-break: break-word;">${message}</p>
      <p style="font-size: 12px; margin-top: 20px; color: #aaa;">
        Check the console for more details.
      </p>
    </div>
  `;
  document.body.appendChild(errorDiv);
};

const setup = () => {
  // Detect if device is likely older/mobile with limited capabilities
  const isOldDevice = () => {
    // Check if max MSAA samples is very low (older devices)
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (gl) {
      const maxSamples = gl.getParameter(gl.MAX_SAMPLES || 0x8d57) || 1;
      return maxSamples <= 2;
    }
    return /iPhone|iPad|iPod|Android/.test(navigator.userAgent);
  };

  // Disable MSAA on older devices, use FXAA instead
  const useAntialias = !isOldDevice();
  console.log("Using hardware antialiasing:", useAntialias);

  renderer = new THREE.WebGLRenderer({
    canvas: $canvas,
    antialias: useAntialias,
  });

  shaderSetup();

  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.5,
    100,
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

  sceneElements = createSceneElements();
  sceneElements.forEach((element, index) => {
    element.mesh.scale.set(0, 0, 0);
    scene.add(element.mesh);

    gsap.to(element.mesh.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 0.6,
      ease: "back.out(1.5)",
      delay: Math.random() * 0.2 + 0.4,
    });
  });

  lightingSetup(scene);

  controls = controlsSetup(camera, renderer);

  // Only setup post-processing on desktop devices
  const isMobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry/i.test(
    navigator.userAgent,
  );
  if (!isMobile) {
    postProcessing = setupPostProcessing(renderer, scene, camera);
  }

  audioSetup();
};

const init = async () => {
  console.log("init starting...");

  // Show mobile preload modal first (if on mobile)
  console.log("About to show mobile preload modal");
  await showMobilePreloadModal();
  console.log("Mobile preload modal completed");

  try {
    console.log("Starting setup...");
    setup();
    console.log("Setup completed successfully");
  } catch (error) {
    console.error("Setup failed:", error);
    showError(`Setup Error: ${error.message}`);
    return;
  }

  // Setup mobile controls
  console.log("Setting up mobile controls...");
  mobileControls = setupMobileControls(camera);
  isOnMobileDevice = mobileControls.isMobile;

  // Create touch data handler for mobile
  const handleTouchData = updateTouchData(camera);

  console.log("Mobile device:", isOnMobileDevice);
  console.log("Gyroscope supported:", mobileControls.isGyroscopeSupported);

  window.addEventListener("resize", resize);
  resize();

  // Desktop mouse controls
  window.addEventListener("mousemove", (e) => {
    mouseShader.x = e.clientX;
    mouseShader.y = e.clientY;

    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    // Only use mouse controls on desktop
    if (!isOnMobileDevice) {
      updateCameraFromMouse(camera, e.clientX, e.clientY);
    }
  });

  // Mobile touch feedback (visual feedback + camera control)
  window.addEventListener("touchmove", (e) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      mouseShader.x = touch.clientX;
      mouseShader.y = touch.clientY;

      mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;

      // Update camera position for mobile devices
      if (isOnMobileDevice) {
        handleTouchData(touch.clientX, touch.clientY);
      }
    }
  });

  window.addEventListener("click", (e) => {
    clickEffect(logoGroup, camera);
  });

  window.addEventListener("touchstart", (e) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];

      // Update touch data for mobile camera control
      if (isOnMobileDevice) {
        handleTouchData(touch.clientX, touch.clientY);
      }

      // Trigger click effect
      clickEffect(logoGroup, camera);
    }
  });

  requestAnimationFrame(draw);
};

const draw = () => {
  const elapsedTime = clock.getElapsedTime();

  floatingAnimation(elapsedTime, logoGroup);
  lettersMouseFollow(lettersGroup, mouse);
  updateCameraLookAtFloat(camera, elapsedTime);

  // Update camera position based on input type
  if (isOnMobileDevice && mobileControls) {
    mobileControls.updateCameraFromMobile();
  }

  materialUniformsUpdate(
    elapsedTime,
    backgroundMaterial,
    testMaterial,
    mouseShader,
  );

  controls.update();

  // Render via post-processing on desktop, direct render on mobile
  if (postProcessing) {
    postProcessing.composer.render();
  } else {
    renderer.render(scene, camera);
  }

  requestAnimationFrame(draw);
};

const resize = () => {
  const width = window.innerWidth * window.devicePixelRatio;
  const height = window.innerHeight * window.devicePixelRatio;

  // Ensure valid dimensions
  if (width <= 0 || height <= 0) {
    console.warn("Invalid window dimensions, skipping resize");
    return;
  }

  renderer.setSize(width, height, false);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  if (postProcessing) {
    postProcessing.handleResize();
  }
};

init().catch((error) => {
  console.error("Fatal error during initialization:", error);
  showError(`Fatal Error: ${error.message}\n\n${error.stack}`);
});
