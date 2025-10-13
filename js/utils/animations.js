import { gsap } from "gsap";

let originalPositions = new Map();

export const floatingAnimation = (elapsedTime, logoGroup) => {
  if (!logoGroup) return;

  const floatAmplitude = 0.1;
  const floatSpeed = 1.15;
  logoGroup.position.y = Math.sin(elapsedTime * floatSpeed) * floatAmplitude;

  const rotationSpeed = 0.5;
  logoGroup.rotation.z = Math.sin(elapsedTime * rotationSpeed) * 0.05;
};

export const lettersMouseFollow = (lettersGroup, mouse) => {
  if (!lettersGroup) return;

  const mouseRotationInfluence = 0.15;

  lettersGroup.rotation.z = -mouse.x * mouseRotationInfluence;
  lettersGroup.rotation.x = -mouse.y * mouseRotationInfluence * 0.7;
};

export const clickEffect = (logoGroup, camera) => {
  if (!logoGroup) return;

  if (!originalPositions.has("logoGroup")) {
    originalPositions.set("logoGroup", logoGroup.position.clone());
  }

  const originalPos = originalPositions.get("logoGroup");

  gsap.to(logoGroup.position, {
    z: originalPos.z - 5,
    duration: 0.4,
    ease: "power2.out",
    onComplete: () => {
      gsap.to(logoGroup.position, {
        z: originalPos.z,
        duration: 1.8,
        ease: "power2.inOut",
      });
    },
  });

  const originalCameraZ = camera.position.z;
  gsap.to(camera.position, {
    z: originalCameraZ + 3,
    duration: 0.2,
    ease: "power2.out",
    onComplete: () => {
      gsap.to(camera.position, {
        z: originalCameraZ,
        duration: 2.0,
        ease: "power2.inOut",
      });
    },
  });
};
