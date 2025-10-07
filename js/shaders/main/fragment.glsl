uniform float iTime;
uniform vec2 iMouse;
uniform vec2 iResolution;
uniform sampler2D iChannel0;

varying vec2 vUv;

const vec2 vp = vec2(320.0, 200.0);

vec2 rot(vec2 uv, float r) {
    float sinX = sin (r);
    float cosX = cos (r);
    float sinY = sin (r);
    mat2 rotationMatrix = mat2( cosX, -sinX, sinY, cosX);
    return uv *rotationMatrix;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec3 col = vec3(.9,.8,.2);  // yellow color
    // vec3 col = vec3(.95,.61,.002);  // blender yellow color (orange)
    
    // Output to screen
    fragColor = vec4(col, 1.0);
}

void main()
{
  vec2 fragCoord = iResolution * vUv;
  mainImage(gl_FragColor, fragCoord);
}