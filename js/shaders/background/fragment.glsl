uniform float iTime;
uniform vec2 iMouse;
uniform vec2 iResolution;
uniform sampler2D iChannel0;

varying vec2 vUv;

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
    float mouseNormalizeY = 1.0 + (iMouse.y / iResolution.x) * 2.5;

    float s = (2.0*mouseNormalizeY);		//stripes
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
    
    vec3 bg = vec3(.9,.8,.2);
    vec3 fg = vec3(.05,.05,.1);
    
    // Subtle anti-aliasing - just enough to smooth edges
    float aa = 0.005;  // Much more subtle anti-aliasing
    float mask = smoothstep(0.5 - aa, 0.5 + aa, uv.y);
    mask += smoothstep(0.5+st - aa, 0.5+st + aa, 1.-uv.y);
    
    vec3 col = mask*bg + (1.-mask)*fg;

    // Output to screen
    fragColor = vec4(col,1.0);
}

void main()
{
  vec2 fragCoord = iResolution * vUv;
  mainImage(gl_FragColor, fragCoord);
}