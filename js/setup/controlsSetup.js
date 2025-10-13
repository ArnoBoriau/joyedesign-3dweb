import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export const controlsSetup = (camera, renderer) => {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 5;
  controls.maxDistance = 45; // sphere radius 50

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

  camera.lookAt(0, 0, 0);
};
