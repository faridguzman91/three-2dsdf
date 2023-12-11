// Three.js Built-in uniforms and attributes
// (these are only a few unconditional ones)
// https://threejs.org/docs/index.html#api/en/renderers/webgl/WebGLProgram
// uniform mat4 viewMatrix;
// uniform vec3 cameraPosition;

float PI = 3.14159265359;
precision highp float;

// #include "../../lygia/sdf/circleSDF.glsl"

uniform float time;
uniform float uLevel;
varying vec2 vUv;

float sdCircle( vec2 p, float r )
{
    return length(p) - r;
}

float sdBox( in vec2 p, in vec2 b )
{
    vec2 d = abs(p)-b;
    return length(max(d,0.0)) + min(max(d.x,d.y),0.0);
}

vec3 pallete(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
  return a + b*cos(6.28318*(c*t*d));
}

// pallete of colors (https://iquilezles.org/articles/palettes/)
vec3 a = vec3(0.5, 0.5, 0.5);		
vec3 b = vec3(0.5, 0.5, 0.5);
vec3 c = vec3(2.0, 1.0, 0.0);
vec3 d = vec3(0.50, 0.20, 0.25);

void main() {

  vec2 uv = vUv - vec2(0.5);
 /*  float scene = sdCircle(uv, 0.2);  */
/* float scene = sdBox(uv, vec2(0.2)); */

/* color(t) = a + b ⋅ cos[2π(c⋅t+d)] */


float scene = mix(
    sdCircle(uv, 0.2),
    sdBox(uv, vec2(0.2)),
    (sin(uLevel*PI*2.)+1.)*0.5
  );

float dd = scene;

// coloring (White)
    vec3 col = vec3(1.); 
    //darker harsh border
    col *= 1.0 - exp(-6.0*abs(dd*5.));
  //black border
	  /* col *= 0.8 + 0.2*cos(150.0*d); */
	 /*  col = mix( col, vec3(1.0), 1.0-smoothstep(0.0,0.01,abs(d)) ); */

  /* vec3 col = vec3(1.) */

  vec3 color = pallete(fract(uLevel)*2., a, b, c, d);

  //cut into main sdf box
if (scene < 0.0) {
    discard;
  }

 //call color combinations
  gl_FragColor = vec4(vec3(vUv.x, vUv.y, 0.0), 1.0);
  gl_FragColor = vec4(col, 1.);
  gl_FragColor = vec4(color, 1.);

}
