import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export const controlsSetup = (camera, renderer) => {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 5;
  controls.maxDistance = 45; // sphere radius 50

  return controls;
};
