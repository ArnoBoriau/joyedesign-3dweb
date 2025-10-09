import * as THREE from "three";

export const lightingSetup = (scene) => {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); // Soft light
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xfff8f0, 1); // Neutral warm (~5000K)
  directionalLight.position.set(10, 10, 5);
  scene.add(directionalLight);

  const pointLight = new THREE.PointLight(0xffedd9, 0.8, 100); // Subtle warm fill (~4000K)
  pointLight.position.set(-10, -10, 10);
  scene.add(pointLight);
};
