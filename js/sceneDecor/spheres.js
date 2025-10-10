import * as THREE from "three";

export const createSpheres = (sphereMaterials) => {
  const elements = [];
  const sphereSizes = [0.8, 1.2, 0.6, 1.0, 0.4];

  sphereSizes.forEach((size, index) => {
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const material = sphereMaterials[index % sphereMaterials.length];
    const sphere = new THREE.Mesh(geometry, material);

    const angle = (index / sphereSizes.length) * Math.PI * 2;
    const radius = 12 + Math.random() * 8;
    sphere.position.set(
      Math.cos(angle) * radius,
      (Math.random() - 0.5) * 10,
      Math.sin(angle) * radius
    );

    elements.push({
      mesh: sphere,
      type: "sphere",
      originalPosition: sphere.position.clone(),
      animationSpeed: 0.3 + Math.random() * 0.4,
    });
  });

  return elements;
};
