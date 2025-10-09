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
