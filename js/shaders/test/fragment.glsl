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

    float s = (1.5*mouseNormalizeY);		//stripes - reduced intensity
    float st = 0.35;		                //stripe thickness - slightly thicker
    float repetition = 3.0;             // Less repetition for subtlety

    vec2 uv = rot(fragCoord/iResolution.xy * repetition, 0.0+sin(iTime)*0.000005);

    
    float osc = sin(uv.x*(uv.x+.5)*(5.*mouseNormalizeX))*0.1;
    uv.y += osc * sin(iTime+uv.x*2.);
    uv.y = fract(uv.y*s);
    
    vec3 bg = vec3(0.95, 0.92, 0.88);  // Subtle warm white
    vec3 fg = vec3(0.85, 0.82, 0.78);  // Slightly darker warm tone
    
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