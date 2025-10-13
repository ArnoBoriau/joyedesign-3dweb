import * as THREE from "three";

export const createFlatCylinders = (cylinderMaterials) => {
  const elements = [];
  const cylinderCount = Math.floor(Math.random() * 4) + 3; // 3-6 cylinders

  for (let i = 0; i < cylinderCount; i++) {
    // Create a very flat cylinder - almost like a disc
    const radius = 1.0 + Math.random() * 1.5; // Radius between 1.0 and 2.5
    const height = 0.05 + Math.random() * 0.1; // Very small height (0.05 to 0.15)
    const radialSegments = 32; // High detail for smooth circular appearance
    const heightSegments = 1; // Only 1 segment needed for flat cylinder

    const geometry = new THREE.CylinderGeometry(
      radius,
      radius,
      height,
      radialSegments,
      heightSegments
    );
    const material = cylinderMaterials[i % cylinderMaterials.length];
    const cylinder = new THREE.Mesh(geometry, material);

    // Position cylinders in a circular arrangement around the scene
    const angle = (i / cylinderCount) * Math.PI * 2;
    const positionRadius = 10 + Math.random() * 6; // Spread them out
    cylinder.position.set(
      Math.cos(angle) * positionRadius,
      -1 + Math.random() * 8, // Y position between -1 and 7
      Math.sin(angle) * positionRadius
    );

    // Add some random rotation to make them more interesting
    cylinder.rotation.set(
      (Math.random() - 0.5) * Math.PI * 0.5, // Slight tilt on X axis
      Math.random() * Math.PI * 2, // Random Y rotation
      (Math.random() - 0.5) * Math.PI * 0.5 // Slight tilt on Z axis
    );

    elements.push({
      mesh: cylinder,
      type: "flatCylinder",
      originalPosition: cylinder.position.clone(),
      originalRotation: cylinder.rotation.clone(),
      animationSpeed: 0.1 + Math.random() * 0.15, // Slower rotation for disc-like objects
    });
  }

  return elements;
};
