import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";

import colorGradingFragmentShader from "../shaders/colorGrading/fragment.glsl?raw";
import colorGradingVertexShader from "../shaders/colorGrading/vertex.glsl?raw";

// Color grading
const ColorGradingShader = {
  name: "ColorGradingShader",
  uniforms: {
    tDiffuse: { value: null },
    exposure: { value: 1.0 },
    contrast: { value: 1.02 },
    saturation: { value: 1.05 },
    brightness: { value: 0.0 },
    warmth: { value: 0.0 },
  },
  vertexShader: colorGradingVertexShader,
  fragmentShader: colorGradingFragmentShader,
};

export const setupPostProcessing = (renderer, scene, camera) => {
  // Create effect composer
  const composer = new EffectComposer(renderer);

  // Renders the scene true post
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  // Color grading pass
  const colorGradingPass = new ShaderPass(ColorGradingShader);
  composer.addPass(colorGradingPass);

  // Anti-aliasing pass
  const fxaaPass = new ShaderPass(FXAAShader);
  fxaaPass.uniforms["resolution"].value.set(
    1 / window.innerWidth,
    1 / window.innerHeight
  );
  composer.addPass(fxaaPass);

  // Handle window resize
  const handleResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    composer.setSize(width, height);
    fxaaPass.uniforms["resolution"].value.set(1 / width, 1 / height);
  };

  return {
    composer,
    handleResize,
  };
};
