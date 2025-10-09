import * as THREE from "three";

import testFragmentShader from "../shaders/test/fragment.glsl?raw";
import testVertexShader from "../shaders/test/vertex.glsl?raw";

import backgroundFragmentShader from "../shaders/background/fragment.glsl?raw";
import backgroundVertexShader from "../shaders/background/vertex.glsl?raw";

export const createShaderMaterials = () => {
  // test shader material
  const testMaterial = new THREE.ShaderMaterial({
    uniforms: {
      iTime: { value: 0 },
      iMouse: { value: new THREE.Vector2(0, 0) },
      iResolution: {
        value: new THREE.Vector2(512, 512),
      },
    },
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
  });

  // Letters material
  const lettersMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0xe7e7e7),
    metalness: 0.25,
    roughness: 0.75,
  });

  // Background sphere shader material
  const backgroundMaterial = new THREE.ShaderMaterial({
    uniforms: {
      iTime: { value: 0 },
      iResolution: {
        value: new THREE.Vector2(512, 512),
      },
      iMouse: { value: new THREE.Vector2(0, 0) },
      lightInfluence: { value: 0.25 },
      ambientLightIntensity: { value: 0.3 },
    },
    vertexShader: backgroundVertexShader,
    fragmentShader: backgroundFragmentShader,
    side: THREE.BackSide, // Render the inside faces of the sphere
  });

  // Main geometry material
  const mainMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0xffcd01),
    metalness: 0.0,
    roughness: 0.5,
  });

  return {
    testMaterial,
    lettersMaterial,
    backgroundMaterial,
    mainMaterial,
  };
};
