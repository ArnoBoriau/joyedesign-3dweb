import * as THREE from "three";

export const createTorus = (torusMaterials) => {
  const elements = [];
  const torusCount = 2;

  for (let i = 0; i < torusCount; i++) {
    const geometry = new THREE.TorusGeometry(2, 0.3, 16, 32);
    const material = torusMaterials[i % torusMaterials.length];
    const torus = new THREE.Mesh(geometry, material);

    const angle = (i / torusCount) * Math.PI * 2;
    const radius = 25;
    torus.position.set(
      Math.cos(angle) * radius,
      5 + Math.random() * 4,
      Math.sin(angle) * radius
    );
    torus.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );

    elements.push({
      mesh: torus,
      type: "torus",
      originalPosition: torus.position.clone(),
      originalRotation: torus.rotation.clone(),
      animationSpeed: 0.15 + Math.random() * 0.1,
    });
  }

  return elements;
};
