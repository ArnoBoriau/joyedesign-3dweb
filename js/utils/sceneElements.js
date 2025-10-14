import * as THREE from "three";
import { createCurvedTubes } from "../sceneDecor/tubes.js";
import { createSpheres } from "../sceneDecor/spheres.js";
import { createTorus } from "../sceneDecor/torus.js";
import { createFlatCylinders } from "../sceneDecor/cylinders.js";

// Manual positioning config
const MANUAL_POSITIONS = {
  spheres: [
    { x: 7, y: 3, z: -1, rotation: { x: 0, y: 0, z: 0 } },
    { x: -6, y: 4, z: 3, rotation: { x: 0, y: 0, z: 0 } },
    { x: 3, y: -2, z: 5, rotation: { x: 0, y: 0, z: 0 } },
    { x: -3, y: 7, z: -3, rotation: { x: 0, y: 0, z: 0 } },
    { x: 8, y: 1, z: 2, rotation: { x: 0, y: 0, z: 0 } },
  ],

  tubes: [
    { x: -2, y: 2, z: 1, rotation: { x: -0.7, y: 0.4, z: 1.0 } },
    { x: 3, y: -1, z: -1, rotation: { x: -0.9, y: 0.2, z: 1.3 } },
    { x: 1, y: 3, z: -2, rotation: { x: -0.6, y: 0.8, z: 0.9 } },
  ],

  toruses: [
    { x: 4, y: 5, z: -2, rotation: { x: -0.8, y: 0.3, z: 1.2 } },
    { x: -5, y: -1, z: 2, rotation: { x: -0.5, y: -1.5, z: 0.2 } },
  ],

  cylinders: [
    { x: 5, y: 5, z: 1, rotation: { x: -0.8, y: 0.5, z: 1.1 } },
    { x: -8, y: 0, z: -1, rotation: { x: -0.7, y: 0.2, z: 1.4 } },
    { x: 4, y: -3, z: -5, rotation: { x: 0.6, y: 0.7, z: 0.8 } },
    { x: -1, y: 8, z: 2, rotation: { x: -0.6, y: 0.4, z: 1.2 } },
  ],
};

const applyManualPositioning = (elements, positions) => {
  elements.forEach((element, index) => {
    if (positions[index]) {
      const pos = positions[index];

      element.mesh.position.set(pos.x, pos.y, pos.z);

      if (pos.rotation) {
        element.mesh.rotation.set(
          pos.rotation.x,
          pos.rotation.y,
          pos.rotation.z
        );
      }

      element.originalPosition = element.mesh.position.clone();
      element.originalRotation = element.mesh.rotation.clone();
    }
  });

  return elements;
};

// Create radial gradient textures
const createRadialGradientTexture = (
  color1,
  color2,
  width = 256,
  height = 256
) => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");

  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(centerX, centerY);

  const gradient = context.createRadialGradient(
    centerX,
    centerY,
    0,
    centerX,
    centerY,
    radius
  );
  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);

  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
};

// Create seamless gradient
const createSeamlessGradientTexture = (
  color1,
  color2,
  width = 256,
  height = 256
) => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");

  // Create a gradient that smoothly transitions and loops back on itself
  const gradient = context.createLinearGradient(0, 0, width, 0);
  gradient.addColorStop(0, color1);
  gradient.addColorStop(0.5, color2);
  gradient.addColorStop(1, color1);

  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
};

// Create vertical gradient
const createVerticalGradientTexture = (
  color1,
  color2,
  width = 256,
  height = 256
) => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");

  // Vertical gradient from top to bottom
  const gradient = context.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);

  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
};

const createArtisticMaterials = () => {
  const materials = {};

  // Radial gradients for spheres
  const sphereGradients = [
    createRadialGradientTexture("#ffcd01", "#d63031"),
    createRadialGradientTexture("#ff8c42", "#6c5ce7"),
    createRadialGradientTexture("#ffcd01", "#e17055"),
    createRadialGradientTexture("#ff6b6b", "#feca57"),
    createRadialGradientTexture("#ff7675", "#fd79a8"),
  ];

  // Vertical gradients for tubes
  const tubeGradients = [
    createVerticalGradientTexture("#ffcd01", "#d63031"),
    createVerticalGradientTexture("#ff8c42", "#6c5ce7"),
    createVerticalGradientTexture("#ffcd01", "#e17055"),
    createVerticalGradientTexture("#ff6b6b", "#feca57"),
    createVerticalGradientTexture("#ff7675", "#fd79a8"),
  ];

  // Seamless gradients for torus
  const torusGradients = [
    createSeamlessGradientTexture("#ffcd01", "#d63031"),
    createSeamlessGradientTexture("#ff8c42", "#6c5ce7"),
    createSeamlessGradientTexture("#ffcd01", "#e17055"),
  ];

  // Sphere materials (radial gradients)
  materials.sphereGradient1 = new THREE.MeshStandardMaterial({
    map: sphereGradients[0],
  });

  materials.sphereGradient2 = new THREE.MeshStandardMaterial({
    map: sphereGradients[1],
  });

  materials.sphereGradient3 = new THREE.MeshStandardMaterial({
    map: sphereGradients[2],
  });

  materials.sphereGradient4 = new THREE.MeshStandardMaterial({
    map: sphereGradients[3],
  });

  materials.sphereGradient5 = new THREE.MeshStandardMaterial({
    map: sphereGradients[4],
  });

  // Tube materials (horizontal gradients)
  materials.tubeGradient1 = new THREE.MeshStandardMaterial({
    map: tubeGradients[0],
  });

  materials.tubeGradient2 = new THREE.MeshStandardMaterial({
    map: tubeGradients[1],
  });

  materials.tubeGradient3 = new THREE.MeshStandardMaterial({
    map: tubeGradients[2],
  });

  // Torus materials (seamless gradients)
  materials.torusGradient1 = new THREE.MeshStandardMaterial({
    map: torusGradients[0],
  });

  materials.torusGradient2 = new THREE.MeshStandardMaterial({
    map: torusGradients[1],
  });

  // Cylinder materials - Emissive glow effect using consistent color scheme
  materials.cylinderGradient1 = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#ffcd01"),
    emissive: new THREE.Color("#e17055"),
    emissiveIntensity: 0.2,
    metalness: 0.0,
    roughness: 0.7,
  });

  materials.cylinderGradient2 = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#ff8c42"),
    emissive: new THREE.Color("#d63031"),
    emissiveIntensity: 0.25,
    metalness: 0.1,
    roughness: 0.6,
  });

  materials.cylinderGradient3 = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#6c5ce7"),
    emissive: new THREE.Color("#fd79a8"),
    emissiveIntensity: 0.15,
    metalness: 0.0,
    roughness: 0.8,
  });

  return materials;
};

export const createSceneElements = () => {
  const materials = createArtisticMaterials();
  const elements = [];

  // Material for each shape type
  const sphereMaterials = [
    materials.sphereGradient1,
    materials.sphereGradient2,
    materials.sphereGradient3,
    materials.sphereGradient4,
    materials.sphereGradient5,
  ];

  const tubeMaterials = [
    materials.tubeGradient1,
    materials.tubeGradient2,
    materials.tubeGradient3,
  ];

  const torusMaterials = [materials.torusGradient1, materials.torusGradient2];

  const cylinderMaterials = [
    materials.cylinderGradient1,
    materials.cylinderGradient2,
    materials.cylinderGradient3,
  ];

  // Create all scene elements with manual positioning
  const spheres = createSpheres(sphereMaterials);
  const positionedSpheres = applyManualPositioning(
    spheres,
    MANUAL_POSITIONS.spheres
  );
  elements.push(...positionedSpheres);

  const curvedTubes = createCurvedTubes(tubeMaterials, 3);
  const positionedTubes = applyManualPositioning(
    curvedTubes,
    MANUAL_POSITIONS.tubes
  );
  elements.push(...positionedTubes);

  const toruses = createTorus(torusMaterials);
  const positionedToruses = applyManualPositioning(
    toruses,
    MANUAL_POSITIONS.toruses
  );
  elements.push(...positionedToruses);

  const flatCylinders = createFlatCylinders(cylinderMaterials);
  const positionedCylinders = applyManualPositioning(
    flatCylinders,
    MANUAL_POSITIONS.cylinders
  );
  elements.push(...positionedCylinders);

  return elements;
};
