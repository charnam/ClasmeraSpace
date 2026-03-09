// https://www.shadertoy.com/view/4tdSWr
// Credit drift (clouds)

// https://www.shadertoy.com/view/tllfRX
// Credit Deadtotem (stars)

precision highp float;

uniform float u_time;
uniform vec2 u_resolution;

// clouds
const float cloudscale = 1.1;
const float speed = 0.008;
const float clouddark = 0.5;
const float cloudlight = 0.3;
const float cloudcover = 0.2;
const float cloudalpha = 8.0;
const float skytint = 0.5;
const vec3 skycolour1 = vec3(0.04, 0.001, 0.1);
const vec3 skycolour2 = vec3(0.04, 0.001, 0.1);
const vec3 cloudcolor = vec3(0.2, 0.08, 0.3);

// stars
const float NUM_LAYERS = 2.;
const float TAU = 6.28318;
const float PI = 3.141592;
const float Velocity = .004;
const float StarGlow = 0.015;
const float StarSize = 8.;
const float CanvasView = 20.;


// Cloud code
const mat2 m = mat2( 1.6,  1.2, -1.2,  1.6 );

vec2 hash( vec2 p ) {
	p = vec2(dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)));
	return -1.0 + 2.0*fract(sin(p)*43758.5453123);
}

float noise( in vec2 p ) {
	const float K1 = 0.366025404; // (sqrt(3)-1)/2;
	const float K2 = 0.211324865; // (3-sqrt(3))/6;
	vec2 i = floor(p + (p.x+p.y)*K1);
	vec2 a = p - i + (i.x+i.y)*K2;
	vec2 o = (a.x>a.y) ? vec2(1.0,0.0) : vec2(0.0,1.0); //vec2 of = 0.5 + 0.5*vec2(sign(a.x-a.y), sign(a.y-a.x));
	vec2 b = a - o + K2;
	vec2 c = a - 1.0 + 2.0*K2;
	vec3 h = max(0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );
	vec3 n = h*h*h*h*vec3( dot(a,hash(i+0.0)), dot(b,hash(i+o)), dot(c,hash(i+1.0)));
	return dot(n, vec3(70.0));
}

float fbm(vec2 n) {
	float total = 0.0, amplitude = 0.1;
	for (int i = 0; i < 7; i++) {
		total += noise(n) * amplitude;
		n = m * n;
		amplitude *= 0.4;
	}
	return total;
}

vec4 mainImage( vec2 fragCoord ) {
	vec2 p = fragCoord.xy / u_resolution.xy;
	vec2 uv = p*vec2(u_resolution.x/u_resolution.y,1.0);
	float time = u_time * speed;
	float q = fbm(uv * cloudscale * 0.5);

	//ridged noise shape
	float r = 0.0;
	uv *= cloudscale;
	uv -= q - time;
	float weight = 0.8;
	for (int i=0; i<8; i++){
		r += abs(weight*noise( uv ));
		uv = m*uv + time;
		weight *= 0.7;
	}

	//noise shape
	float f = 0.0;
	uv = p*vec2(u_resolution.x/u_resolution.y,1.0);
	uv *= cloudscale;
	uv -= q - time;
	weight = 0.7;
	for (int i=0; i<8; i++){
		f += weight*noise( uv );
		uv = m*uv + time;
		weight *= 0.6;
	}

	f *= r + f;

	//noise colour
	float c = 0.0;
	time = u_time * speed * 2.0;
	uv = p*vec2(u_resolution.x/u_resolution.y,1.0);
	uv *= cloudscale*2.0;
	uv -= q - time;
	weight = 0.4;
	for (int i=0; i<7; i++){
		c += weight*noise( uv );
		uv = m*uv + time;
		weight *= 0.6;
	}

	//noise ridge colour
	float c1 = 0.0;
	time = u_time * speed * 3.0;
	uv = p*vec2(u_resolution.x/u_resolution.y,1.0);
	uv *= cloudscale*3.0;
	uv -= q - time;
	weight = 0.4;
	for (int i=0; i<7; i++){
		c1 += abs(weight*noise( uv ));
		uv = m*uv + time;
		weight *= 0.6;
	}

	c += c1;

	vec3 skycolour = mix(skycolour2, skycolour1, p.y);
	vec3 cloudcolour = cloudcolor * clamp((clouddark + cloudlight*c), 0.0, 1.0);

	f = cloudcover + cloudalpha*f*r;

	vec3 result = mix(skycolour, clamp(skytint * skycolour + cloudcolour, 0.0, 1.0), clamp(f + c, 0.0, 1.0));

	return vec4( result, 1.0 );
}

// Star code
float Star(vec2 uv, float flare){
	float d = length(uv);
	float m = sin(StarGlow*1.2)/d;
	float rays = max(0., .5-abs(uv.x*uv.y*1000.));
	m += (rays*flare)*2.;
	m *= smoothstep(1., .1, d);
	return m;
}

float Hash21(vec2 p){
	p = fract(p*vec2(123.34, 456.21));
	p += dot(p, p+45.32);
	return fract(p.x*p.y);
}

vec3 StarLayer(vec2 uv){
	vec3 col = vec3(0);
	vec2 gv = fract(uv);
	vec2 id = floor(uv);
	for(int y=-1;y<=1;y++){
		for(int x=-1; x<=1; x++){
			vec2 offs = vec2(x,y);
			float n = Hash21(id+offs);
			float size = fract(n);
			float star = Star(gv-offs-vec2(n, fract(n*34.))+.5, smoothstep(.1,.9,size)*.16);
			vec3 color = sin(vec3(.2,.3,.9)*fract(n*2345.2)*TAU)*.25+.75;
			color = color*vec3(.9,.59,.9+size);
			star *= sin(u_time*.6+n*TAU)*.5+.5;
			col += star*size*color;
		}
	}
	return col;
}

vec4 stars(vec2 fragCoord) {
	vec2 uv = (fragCoord-.5*u_resolution.xy)/u_resolution.y;
	vec2 M = vec2(u_time * 0.2, u_time * 0.1);
	//M +=(iMouse.xy-u_resolution.xy*.5)/u_resolution.y;
	float t = u_time*Velocity; 
	vec3 col = vec3(0);  
	for(float i=0.; i<1.; i+=1./NUM_LAYERS){
		float depth = fract(i+t);
		float scale = mix(CanvasView, .5, depth);
		float fade = depth*smoothstep(1.,.9,depth);
		col += StarLayer(uv*scale+i*453.2-u_time*.05+M)*fade;}   
	return vec4(col,1.0);
}

void main() {
	//vec2 coord = gl_FragCoord.xy / u_resolution.xy * vec2(u_resolution.x/u_resolution.y,1.0);
	
	vec4 origin = mainImage(gl_FragCoord.xy);
	vec4 star = stars(gl_FragCoord.xy);
	gl_FragColor = origin * 4.0 * max(star, vec4(0.2));
}