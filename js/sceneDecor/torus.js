import * as THREE from "three";

export const createTorus = (torusMaterials) => {
  const elements = [];
  const torusCount = torusMaterials.length;

  for (let i = 0; i < torusCount; i++) {
    const torusRadius = 0.8 + Math.random() * 0.6;
    const tubeRadius = 0.3 + Math.random() * 0.2;

    const geometry = new THREE.TorusGeometry(torusRadius, tubeRadius, 16, 32);
    const material = torusMaterials[i % torusMaterials.length];
    const torus = new THREE.Mesh(geometry, material);

    torus.position.set(0, 0, 0);
    torus.rotation.set(0, 0, 0);

    elements.push({
      mesh: torus,
      type: "torus",
      originalPosition: new THREE.Vector3(0, 0, 0),
      originalRotation: new THREE.Euler(0, 0, 0),
      animationSpeed: 0.15 + Math.random() * 0.1,
    });
  }

  return elements;
};
