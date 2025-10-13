import * as THREE from "three";

export const createSpheres = (sphereMaterials) => {
  const elements = [];
  const sphereSizes = [0.8, 1.2, 0.6, 1.0, 0.4];

  sphereSizes.forEach((size, index) => {
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const material = sphereMaterials[index % sphereMaterials.length];
    const sphere = new THREE.Mesh(geometry, material);

    sphere.position.set(0, 0, 0);

    elements.push({
      mesh: sphere,
      type: "sphere",
      originalPosition: new THREE.Vector3(0, 0, 0),
      animationSpeed: 0.3 + Math.random() * 0.4,
    });
  });

  return elements;
};
