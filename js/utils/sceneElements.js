import * as THREE from "three";

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

  return materials;
};

// Create geometric elements
export const createSceneElements = () => {
  const materials = createArtisticMaterials();
  const elements = [];

  // Create floating spheres
  const sphereSizes = [0.8, 1.2, 0.6, 1.0, 0.4];
  const sphereMaterials = [
    materials.sphereGradient1,
    materials.sphereGradient2,
    materials.sphereGradient3,
    materials.sphereGradient4,
    materials.sphereGradient5,
  ];
  sphereSizes.forEach((size, index) => {
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const material = sphereMaterials[index % sphereMaterials.length];
    const sphere = new THREE.Mesh(geometry, material);

    // Position spheres
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

  // Create cylindrical tubes
  const tubeCount = 3;
  const tubeMaterials = [
    materials.tubeGradient1,
    materials.tubeGradient2,
    materials.tubeGradient3,
  ];
  for (let i = 0; i < tubeCount; i++) {
    const geometry = new THREE.CylinderGeometry(0.2, 0.2, 6, 8, 1, true);
    const material = tubeMaterials[i % tubeMaterials.length];
    const tube = new THREE.Mesh(geometry, material);

    // Position tubes
    const angle = (i / tubeCount) * Math.PI * 2 + Math.PI / 3;
    const radius = 18;
    tube.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
    tube.rotation.z = Math.random() * 0.3;

    elements.push({
      mesh: tube,
      type: "tube",
      originalPosition: tube.position.clone(),
      originalRotation: tube.rotation.clone(),
      animationSpeed: 0.2 + Math.random() * 0.2,
    });
  }

  // Create torus shapes
  const torusCount = 2;
  const torusMaterials = [materials.torusGradient1, materials.torusGradient2];
  for (let i = 0; i < torusCount; i++) {
    const geometry = new THREE.TorusGeometry(2, 0.3, 16, 32);
    const material = torusMaterials[i % torusMaterials.length];
    const torus = new THREE.Mesh(geometry, material);

    // Position torus shapes
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
