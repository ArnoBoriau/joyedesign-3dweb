import { gsap } from "gsap";

let originalPositions = new Map();

export const floatingAnimation = (elapsedTime, logoGroup) => {
  if (!logoGroup) return;

  const floatAmplitude = 0.2;
  const floatSpeed = 1.15;
  logoGroup.position.y = Math.sin(elapsedTime * floatSpeed) * floatAmplitude;

  const rotationSpeed = 0.5;
  logoGroup.rotation.z = Math.sin(elapsedTime * rotationSpeed) * 0.05;
};

export const lettersMouseFollow = (lettersGroup, mouse) => {
  if (!lettersGroup) return;

  const mouseRotationInfluence = 0.2;

  lettersGroup.rotation.z = -mouse.x * mouseRotationInfluence;
  lettersGroup.rotation.x = -mouse.y * mouseRotationInfluence * 1.25;
};

export const clickEffect = (logoGroup) => {
  if (!logoGroup) return;

  if (!originalPositions.has("logoRotation")) {
    originalPositions.set("logoRotation", {
      x: logoGroup.rotation.x,
      y: logoGroup.rotation.y,
      z: logoGroup.rotation.z,
    });
  }

  if (!originalPositions.has("logoGroup")) {
    originalPositions.set("logoGroup", logoGroup.position.clone());
  }

  const originalRotation = originalPositions.get("logoRotation");
  const originalPos = originalPositions.get("logoGroup");

  // Smooth : )
  const tl = gsap.timeline();

  tl.to(logoGroup.position, {
    y: originalPos.y - 1.5,
    duration: 0.2,
    ease: "power2.inOut",
  })
    .to(logoGroup.position, {
      y: originalPos.y + 4,
      duration: 0.5,
      ease: "power3.out",
    })
    .to(
      logoGroup.rotation,
      {
        y: originalRotation.y + Math.PI * 2,
        duration: 1.2,
        ease: "power2.inOut",
        onComplete: () => {
          logoGroup.rotation.y = originalRotation.y; // Reset
        },
      },
      "<"
    )
    .to(logoGroup.position, {
      y: originalPos.y - 0.5,
      duration: 0.3,
      ease: "power3.in",
    })
    .to(logoGroup.position, {
      y: originalPos.y,
      duration: 0.2,
      ease: "elastic.out(2, 0.3)",
    });
};
