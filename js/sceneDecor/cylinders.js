import * as THREE from "three";

export const createFlatCylinders = (cylinderMaterials) => {
  const elements = [];
  const cylinderCount = cylinderMaterials.length;

  for (let i = 0; i < cylinderCount; i++) {
    // Create a very flat cylinder
    const radius = 1.0 + Math.random() * 1.5;
    const height = 0.05 + Math.random() * 0.1;
    const radialSegments = 32;
    const heightSegments = 1;

    const geometry = new THREE.CylinderGeometry(
      radius,
      radius,
      height,
      radialSegments,
      heightSegments
    );
    const material = cylinderMaterials[i % cylinderMaterials.length];
    const cylinder = new THREE.Mesh(geometry, material);

    cylinder.position.set(0, 0, 0);
    cylinder.rotation.set(0, 0, 0);

    elements.push({
      mesh: cylinder,
      type: "flatCylinder",
      originalPosition: new THREE.Vector3(0, 0, 0),
      originalRotation: new THREE.Euler(0, 0, 0),
      animationSpeed: 0.1 + Math.random() * 0.15,
    });
  }

  return elements;
};
