
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { gsap } from "gsap";

export const blenderLoader = (scene, camera, lettersMaterial, mainMaterial) => {
  return new Promise((resolve) => {
    const loader = new GLTFLoader();

    loader.load("assets/logo_joyedesign.glb", (gltf) => {
      const logoGroup = new THREE.Group();
      const lettersGroup = new THREE.Group();
      const logoBackgroundGroup = new THREE.Group();
      const lettersObjects = [];
      const backgroundObjects = [];

      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          if (child.name === "J-letter" || child.name === "D-letter") {
            child.material = lettersMaterial;
            lettersObjects.push(child);
          } else {
            child.material = mainMaterial;
            backgroundObjects.push(child);
          }
        }
      });
      lettersObjects.forEach((obj) => lettersGroup.add(obj));
      backgroundObjects.forEach((obj) => logoBackgroundGroup.add(obj));
      logoGroup.add(lettersGroup);
      logoGroup.add(logoBackgroundGroup);

      logoGroup.rotation.x = Math.PI / 2;
      logoGroup.scale.set(0, 0, 0);

      scene.add(logoGroup);

      gsap.to(logoGroup.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.75,
        ease: "back.out(1.75)",
        delay: 0.2,
      });

      gsap.to(camera.position, {
        z: 15,
        duration: 0.75,
        ease: "power3.out",
        delay: 0.2,
      });

      // Return
      resolve({ logoGroup, lettersGroup, logoBackgroundGroup });
    });
  });
};
