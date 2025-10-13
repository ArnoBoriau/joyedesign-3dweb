uniform sampler2D tDiffuse;
    uniform float exposure;
    uniform float contrast;
    uniform float saturation;
    uniform float brightness;
    uniform float warmth;
    varying vec2 vUv;

    vec3 adjustSaturation(vec3 color, float saturation) {
      float luminance = dot(color, vec3(0.299, 0.587, 0.114));
      return mix(vec3(luminance), color, saturation);
    }

    void main() {
      vec4 texel = texture2D(tDiffuse, vUv);
      vec3 color = texel.rgb;
      
      // Apply exposure
      color *= exposure;
      
      // Apply brightness
      color += brightness;
      
      // Apply contrast
      color = (color - 0.5) * contrast + 0.5;
      
      // Apply saturation
      color = adjustSaturation(color, saturation);
      
      // Add warmth
      color.r += warmth * 0.1;
      color.g += warmth * 0.05;
      
      // No tone mapping - preserve original brightness
      
      gl_FragColor = vec4(color, texel.a);
    }