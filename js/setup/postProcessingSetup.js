import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

import colorGradingFragmentShader from "../shaders/colorGrading/fragment.glsl?raw";
import colorGradingVertexShader from "../shaders/colorGrading/vertex.glsl?raw";

// Color grading
const ColorGradingShader = {
  name: "ColorGradingShader",
  uniforms: {
    tDiffuse: { value: null },
    exposure: { value: 0.95 },
    contrast: { value: 1.05 },
    saturation: { value: 1.35 },
    brightness: { value: 0.01 },
    warmth: { value: 0.2 },
  },
  vertexShader: colorGradingVertexShader,
  fragmentShader: colorGradingFragmentShader,
};

export const setupPostProcessing = (renderer, scene, camera) => {
  try {
    // Detect mobile device
    const isMobile =
      /iPhone|iPad|iPod|Android|webOS|BlackBerry|Opera Mini/i.test(
        navigator.userAgent,
      );

    // Detect maximum supported MSAA samples for the device
    const gl = renderer.getContext();
    let maxSamples = 1; // Default to 1 (no MSAA)

    // Only attempt to read MAX_SAMPLES on desktop
    if (!isMobile && gl.MAX_SAMPLES !== undefined) {
      const supported = gl.getParameter(gl.MAX_SAMPLES) || 1;
      maxSamples = Math.min(supported, 4);
    }

    console.log("Device is mobile:", isMobile);
    console.log("Max MSAA samples to use:", maxSamples);

    // Ensure dimensions are valid
    const width = Math.max(1, window.innerWidth);
    const height = Math.max(1, window.innerHeight);

    console.log("Creating render target with dimensions:", width, height);

    // Render target for anti-aliasing
    const renderTarget = new THREE.WebGLRenderTarget(width, height, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
      samples: maxSamples,
    });

    console.log("Render target created successfully");

    // Create effect composer
    const composer = new EffectComposer(renderer, renderTarget);
    console.log("Effect composer created successfully");

    // Renders the scene true post
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    // Color grading pass
    const colorGradingPass = new ShaderPass(ColorGradingShader);
    composer.addPass(colorGradingPass);

    // Bloom pass
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.15,
      0.5,
      0.95,
    );
    composer.addPass(bloomPass);

    // Anti-aliasing pass
    const fxaaPass = new ShaderPass(FXAAShader);
    fxaaPass.uniforms["resolution"].value.set(
      1 / (window.innerWidth * window.devicePixelRatio),
      1 / (window.innerHeight * window.devicePixelRatio),
    );
    composer.addPass(fxaaPass);

    const handleResize = () => {
      const width = Math.max(1, window.innerWidth * window.devicePixelRatio);
      const height = Math.max(1, window.innerHeight * window.devicePixelRatio);

      // Prevent invalid size operations
      if (width > 0 && height > 0) {
        composer.setSize(width, height);
        renderTarget.setSize(width, height);
        fxaaPass.uniforms["resolution"].value.set(1 / width, 1 / height);
      }
    };

    console.log("Post-processing setup complete");
    return {
      composer,
      handleResize,
    };
  } catch (error) {
    console.error("Post-processing setup failed with error:", error);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    return null;
  }
};
