/**
 * Mobile controls setup
 * Handles gyroscope, accelerometer, and touch input for mobile devices
 */

export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPot|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
};

/**
 * Show mobile preload modal and handle gyroscope permission
 * Returns a promise that resolves when user dismisses the modal
 */
export const showMobilePreloadModal = async () => {
  const isMobile = isMobileDevice();
  console.log("showMobilePreloadModal - isMobile:", isMobile);

  if (!isMobile) {
    console.log("Not a mobile device, skipping modal");
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    console.log("Showing mobile preload modal");
    const modal = document.getElementById("mobile-preload-modal");
    const okBtn = document.getElementById("mobile-preload-ok-btn");

    if (!modal || !okBtn) {
      console.warn("Mobile preload modal elements not found");
      resolve();
      return;
    }

    // Show the modal
    console.log("Setting modal display to flex");
    modal.style.display = "flex";

    // Add hover effects to match music button style
    okBtn.addEventListener("mouseenter", () => {
      okBtn.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
    });

    okBtn.addEventListener("mouseleave", () => {
      okBtn.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    });

    // Handle OK button click
    okBtn.addEventListener("click", async () => {
      console.log("OK button clicked");
      modal.style.display = "none";

      // Request gyroscope permission
      await requestGyroscopePermission();

      console.log("Resolving modal promise");
      resolve();
    });
  });
};

/**
 * Request gyroscope permission and attach listener
 */
const requestGyroscopePermission = async () => {
  if (
    typeof DeviceOrientationEvent !== "undefined" &&
    typeof DeviceOrientationEvent.requestPermission === "function"
  ) {
    // iOS 13+
    try {
      const permission = await DeviceOrientationEvent.requestPermission();
      if (permission === "granted") {
        console.log("Gyroscope permission granted");
        return true;
      } else {
        console.warn("Gyroscope permission denied");
        return false;
      }
    } catch (error) {
      console.warn("Gyroscope permission error:", error);
      return false;
    }
  } else {
    // Non-iOS 13+ devices - permission not needed
    if (typeof DeviceOrientationEvent !== "undefined") {
      console.log("Gyroscope available (no permission needed)");
      return true;
    } else {
      console.warn("DeviceOrientationEvent not supported");
      return false;
    }
  }
};

const updateTouchDataFunc = (camera) => {
  return (x, y) => {
    const touchData = { x: x / window.innerWidth, y: y / window.innerHeight };
    
    // Update camera from touch
    const normalizedX = (touchData.x * 2 - 1) * 0.35;
    const normalizedY = touchData.y;

    const minDistance = 7.5;
    const maxDistance = 35;
    const distance = minDistance + normalizedY * (maxDistance - minDistance);

    const maxOrbitAngle = Math.PI;
    const orbitAngle = normalizedX * maxOrbitAngle;

    camera.position.x = Math.sin(orbitAngle) * distance * 0.5;
    camera.position.z = Math.cos(orbitAngle) * distance;
    camera.position.y = normalizedX * 2;
  };
};

export { updateTouchDataFunc as updateTouchData };

export const setupMobileControls = (camera) => {
  const isMobile = isMobileDevice();

  if (!isMobile) {
    return { isGyroscopeSupported: false, isMobile: false };
  }

  let isGyroscopeSupported = false;
  let isGyroscopeActive = false;
  const gyroData = { alpha: 0, beta: 0, gamma: 0 };
  const touchData = { x: 0, y: 0 };

  // Attach gyroscope listener (permission already handled in preload modal)
  const attachGyroscopeListener = () => {
    if (typeof DeviceOrientationEvent !== "undefined") {
      window.addEventListener("deviceorientation", (event) => {
        gyroData.alpha = event.alpha || 0; // Z axis: 0 to 360
        gyroData.beta = event.beta || 0; // X axis: -180 to 180
        gyroData.gamma = event.gamma || 0; // Y axis: -90 to 90
      });
      isGyroscopeSupported = true;
      isGyroscopeActive = true;
      console.log("Gyroscope listener attached");
    }
  };

  /**
   * Update camera position based on gyroscope or touch input
   */
  const updateCameraFromMobile = () => {
    if (isGyroscopeActive) {
      updateCameraFromGyroscope();
    } else {
      updateCameraFromTouch();
    }
  };

  const updateCameraFromGyroscope = () => {
    // Convert gyroscope data to camera position
    // Beta: rotation around X axis (pitch) - controls vertical rotation
    // Gamma: rotation around Y axis (roll) - controls horizontal rotation

    const normalizedGamma = (gyroData.gamma / 90) * 0.35; // -0.35 to 0.35
    const normalizedBeta = (gyroData.beta / 180) * 0.5; // -0.5 to 0.5 (normalized to 0-1 range)
    const normalizedBetaAsY = (gyroData.beta + 180) / 360; // 0 to 1

    const minDistance = 7.5;
    const maxDistance = 35;
    const distance =
      minDistance + normalizedBetaAsY * (maxDistance - minDistance);

    const maxOrbitAngle = Math.PI;
    const orbitAngle = normalizedGamma * maxOrbitAngle;

    camera.position.x = Math.sin(orbitAngle) * distance * 0.5;
    camera.position.z = Math.cos(orbitAngle) * distance;
    camera.position.y = normalizedGamma * 2;
  };

  const updateCameraFromTouch = () => {
    // Use touch data similar to mouse data
    const normalizedX = (touchData.x * 2 - 1) * 0.35;
    const normalizedY = touchData.y;

    const minDistance = 7.5;
    const maxDistance = 35;
    const distance = minDistance + normalizedY * (maxDistance - minDistance);

    const maxOrbitAngle = Math.PI;
    const orbitAngle = normalizedX * maxOrbitAngle;

    camera.position.x = Math.sin(orbitAngle) * distance * 0.5;
    camera.position.z = Math.cos(orbitAngle) * distance;
    camera.position.y = normalizedX * 2;
  };

  // Attach gyroscope listener only (touch is handled in script.js)
  attachGyroscopeListener();

  return {
    isGyroscopeSupported,
    isMobile,
    updateCameraFromMobile,
    getGyroData: () => ({ ...gyroData }),
    getTouchData: () => ({ ...touchData }),
  };
};

/**
 * Check WebGL support and provide diagnostics
 */
export const checkWebGLSupport = () => {
  const canvas = document.createElement("canvas");

  // Try WebGL 2 first (better compatibility with modern shaders)
  let gl = canvas.getContext("webgl2");
  let version = "webgl2";

  // Fall back to WebGL 1
  if (!gl) {
    gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    version = "webgl1";
  }

  if (!gl) {
    return {
      supported: false,
      version: null,
      vendor: "Unknown",
      message: "WebGL is not supported on this device",
    };
  }

  const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
  const vendor = debugInfo
    ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
    : "Unknown";
  const renderer = debugInfo
    ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
    : "Unknown";

  return {
    supported: true,
    version,
    vendor,
    renderer,
    message: `WebGL ${version.toUpperCase()} supported (${vendor} - ${renderer})`,
  };
};

/**
 * Handle shader compatibility for older WebGL implementations
 */
export const getShaderVersion = () => {
  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");

  if (!gl) {
    return "precision mediump float;";
  }

  // WebGL 2 and modern WebGL 1 support highp
  const shaderPrecision = gl.getShaderPrecisionFormat(
    gl.FRAGMENT_SHADER,
    gl.HIGH_FLOAT,
  );

  if (shaderPrecision && shaderPrecision.precision > 0) {
    return "precision highp float;";
  }

  return "precision mediump float;";
};
