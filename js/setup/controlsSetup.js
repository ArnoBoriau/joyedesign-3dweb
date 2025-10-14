import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export const controlsSetup = (camera, renderer) => {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 5;
  controls.maxDistance = 45; // sphere radius 50

  // Disable controls for custom mouse movement
  controls.enableRotate = false;
  controls.enableZoom = false;
  controls.enablePan = false;

  return controls;
};

export const updateCameraFromMouse = (camera, mouseX, mouseY) => {
  const normalizedX = ((mouseX / window.innerWidth) * 2 - 1) * 0.35;
  const normalizedY = mouseY / window.innerHeight;

  const minDistance = 7.5;
  const maxDistance = 35;
  const distance = minDistance + normalizedY * (maxDistance - minDistance);

  const maxOrbitAngle = Math.PI;
  const orbitAngle = normalizedX * maxOrbitAngle;

  camera.position.x = Math.sin(orbitAngle) * distance * 0.5;
  camera.position.z = Math.cos(orbitAngle) * distance;
  camera.position.y = normalizedX * 2;
};

// Animate the camera's lookAt target point
export const updateCameraLookAtFloat = (camera, elapsedTime) => {
  const baseX = 0;
  const baseY = 0;
  const baseZ = 0;

  const floatAmplitudeX = 0.3;
  const floatAmplitudeY = 0.2;
  const floatAmplitudeZ = 0.15;

  const floatSpeedX = 0.6;
  const floatSpeedY = 0.8;
  const floatSpeedZ = 0.4;

  const floatX = Math.sin(elapsedTime * floatSpeedX) * floatAmplitudeX;
  const floatY = Math.sin(elapsedTime * floatSpeedY) * floatAmplitudeY;
  const floatZ = Math.sin(elapsedTime * floatSpeedZ) * floatAmplitudeZ;

  const targetX = baseX + floatX;
  const targetY = baseY + floatY;
  const targetZ = baseZ + floatZ;

  camera.lookAt(targetX, targetY, targetZ);
};
