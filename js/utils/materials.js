import * as THREE from "three";

import testFragmentShader from "../shaders/test/fragment.glsl?raw";
import testVertexShader from "../shaders/test/vertex.glsl?raw";

import lettersFragmentShader from "../shaders/letters-shader/fragment.glsl?raw";
import lettersVertexShader from "../shaders/letters-shader/vertex.glsl?raw";

import backgroundFragmentShader from "../shaders/background/fragment.glsl?raw";
import backgroundVertexShader from "../shaders/background/vertex.glsl?raw";

import mainFragmentShader from "../shaders/main/fragment.glsl?raw";
import mainVertexShader from "../shaders/main/vertex.glsl?raw";

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

  // letters shader material
  const lettersMaterial = new THREE.ShaderMaterial({
    uniforms: {
      iTime: { value: 0 },
      iMouse: { value: new THREE.Vector2(0, 0) },
      iResolution: {
        value: new THREE.Vector2(512, 512),
      },
    },
    vertexShader: lettersVertexShader,
    fragmentShader: lettersFragmentShader,
  });

  // background plane shader material
  const backgroundMaterial = new THREE.ShaderMaterial({
    uniforms: {
      iTime: { value: 0 },
      iResolution: {
        value: new THREE.Vector2(512, 512),
      },
      iMouse: { value: new THREE.Vector2(0, 0) },
    },
    vertexShader: backgroundVertexShader,
    fragmentShader: backgroundFragmentShader,
    side: THREE.BackSide, // Render the inside faces of the sphere
  });

  // main shader material
  const mainMaterial = new THREE.ShaderMaterial({
    uniforms: {
      iTime: { value: 0 },
      iResolution: {
        value: new THREE.Vector2(512, 512),
      },
      iMouse: { value: new THREE.Vector2(0, 0) },
    },
    vertexShader: mainVertexShader,
    fragmentShader: mainFragmentShader,
  });

  return {
    testMaterial,
    lettersMaterial,
    backgroundMaterial,
    mainMaterial,
  };
};
