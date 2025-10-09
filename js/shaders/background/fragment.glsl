uniform float iTime;
uniform vec2 iMouse;
uniform vec2 iResolution;
uniform sampler2D iChannel0;

// Lighting uniforms
uniform float lightInfluence;
uniform float ambientLightIntensity;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

const vec2 vp = vec2(320.0, 200.0);

//https://www.shadertoy.com/view/WsB3Wc

vec2 rot(vec2 uv, float r) {
    float sinX = sin (r);
    float cosX = cos (r);
    float sinY = sin (r);
    mat2 rotationMatrix = mat2( cosX, -sinX, sinY, cosX);
    return uv *rotationMatrix;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalize mouse Value
    float mouseNormalizeX = 0.10 + (iMouse.x / iResolution.x) * 0.750;
    float mouseNormalizeY = 1.5 + (iMouse.y / iResolution.x);

    float s = (1.5*mouseNormalizeY);		//stripes
    float st = 0.25;		                //stripe thickness
    float repetition = 4.0;             // Add repetition factor

    vec2 uv = fragCoord/iResolution.xy * repetition;
    
    // Instead of rotating the UV, rotate the pattern using sin/cos for seamless wrapping
    float angle = 0.0 + sin(iTime) * 0.000005;
    float cosA = cos(angle);
    float sinA = sin(angle);
    
    // Use multiple offset sine waves to break up regular patterns
    float x = uv.x * 6.28318530718; // Convert to radians for full 2*PI wrap
    float seamlessX = sin(x) * cosA + cos(x) * sinA; // Rotated seamless coordinate
    
    // Combine multiple frequencies to avoid apparent source points
    float osc1 = sin(seamlessX * 3.0 * mouseNormalizeX) * 0.03;
    float osc2 = sin(seamlessX * 7.0 * mouseNormalizeX + 1.5) * 0.02;
    float osc = osc1 + osc2;
    uv.y += osc * sin(iTime + seamlessX * 2.0);
    uv.y = fract(uv.y * s);
    
    // vec3 bg = vec3(.9,.8,.2);
    vec3 bg = vec3(.95,.75,.15);
    vec3 fg = vec3(.05,.05,.1);
    
    // Subtle anti-aliasing - just enough to smooth edges
    float aa = 0.005;  // Much more subtle anti-aliasing
    float mask = smoothstep(0.5 - aa, 0.5 + aa, uv.y);
    mask += smoothstep(0.5+st - aa, 0.5+st + aa, 1.-uv.y);
    
    vec3 col = mask*bg + (1.-mask)*fg;

    // Realistic lighting calculation
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(-vPosition); // Camera direction
    
    // Multiple light sources matching the scene setup
    // Main directional light (simulating sun/key light)
    vec3 dirLight1 = normalize(vec3(1.0, 1.0, 0.5));
    float dirLightIntensity1 = 1.0;
    float NdotL1 = max(dot(normal, dirLight1), 0.0);
    
    // Secondary point light (fill light)
    vec3 pointLightPos = vec3(-10.0, -10.0, 10.0);
    vec3 pointLightDir = normalize(pointLightPos - vPosition);
    float pointLightDistance = length(pointLightPos - vPosition);
    float pointLightAttenuation = 1.0 / (1.0 + 0.01 * pointLightDistance + 0.001 * pointLightDistance * pointLightDistance);
    float NdotL2 = max(dot(normal, pointLightDir), 0.0);
    
    // Rim lighting for more realistic depth
    float rimPower = 2.0;
    float rim = 1.0 - max(dot(viewDir, normal), 0.0);
    rim = smoothstep(0.6, 1.0, rim);
    
    // Combine lighting components
    vec3 directionalLight = vec3(1.0) * NdotL1 * dirLightIntensity1;
    vec3 pointLight = vec3(0.8, 0.9, 1.0) * NdotL2 * pointLightAttenuation * 0.8;
    vec3 rimLight = vec3(0.3, 0.4, 0.6) * rim * 0.5;
    vec3 ambient = vec3(ambientLightIntensity);
    
    // Total lighting
    vec3 totalLight = ambient + directionalLight + pointLight + rimLight;
    totalLight = clamp(totalLight, 0.0, 2.0); // Prevent over-bright areas
    
    // Apply lighting to color
    col = mix(col, col * totalLight, lightInfluence);

    // Output to screen
    fragColor = vec4(col,1.0);
}

void main()
{
  vec2 fragCoord = iResolution * vUv;
  mainImage(gl_FragColor, fragCoord);
}