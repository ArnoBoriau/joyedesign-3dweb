export const materialUniformsUpdate = (
  elapsedTime,
  backgroundMaterial,
  testMaterial,
  mouseShader
) => {
  // Update background material uniforms (ShaderMaterial)
  backgroundMaterial.uniforms.iTime.value = elapsedTime;
  backgroundMaterial.uniforms.iMouse.value.x = mouseShader.x;
  backgroundMaterial.uniforms.iMouse.value.y = mouseShader.y;
  backgroundMaterial.uniforms.lightInfluence.value = 0.25;
  backgroundMaterial.uniforms.ambientLightIntensity.value = 0.3;

  // Update test material uniforms (ShaderMaterial)
  testMaterial.uniforms.iTime.value = elapsedTime;
  testMaterial.uniforms.iMouse.value.x = mouseShader.x;
  testMaterial.uniforms.iMouse.value.y = mouseShader.y;
};
