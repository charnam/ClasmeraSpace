// "RayMarching starting point" 
// by Martijn Steinrucken aka The Art of Code/BigWings - 2020
// The MIT License
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
// Email: countfrolic@gmail.com
// Twitter: @The_ArtOfCode
// YouTube: youtube.com/TheArtOfCodeIsCool
// Facebook: https://www.facebook.com/groups/theartofcode/
//
// You can use this shader as a template for ray marching shaders

precision highp float;

uniform float u_time;
uniform vec2 u_resolution;

const float pi = 3.14159;

vec3 pal( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{
    return a + b*cos( 6.28318*(c*t+d) );
}

float h21 (vec2 a) {
    return fract(sin(dot(a.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float mlength(vec2 uv) {
    return max(abs(uv.x), abs(uv.y));
}



const int MAX_STEPS = 400;
const float MAX_DIST = 10.;
const float SURF_DIST = .001;

mat2 Rot(float a) {
    float s=sin(a), c=cos(a);
    return mat2(c, -s, s, c);
}

float GetDist(vec3 p) {
    vec2 uv = p.xz;
    
    uv.x = abs(uv.x);
    float time = 12. + u_time / 50.0; // 0.3 * h21(floor(10. * uv))  //<-very cool extremely laggy
    vec2 q = vec2(1,0);
    
    float th = 0.4 * p.y - 0.6 * time;
    float n = 9.;
    float m = -0.0 * length(uv) + 1.8;
    for (float i = 0.; i < 9.; i++) { 
        uv -= m * q;
        th += 0.5 * p.y + 0.05 * time;
        uv = Rot(th) * uv;
        uv.x = abs(uv.x);
        m *= 0.05 * cos(8. * length(uv)) +  0.55;// + 0.05 * cos(0.4 * p.y - 0.6 * iTime);
        //m += m * cos(iTime);
    }
    
    float d = length(uv) - 2. * m;
    
    //float d = length(uv)- 0.5;
    
    return 0.5 * d; // was 0.35
}

float RayMarch(vec3 ro, vec3 rd) {
	float dO=0.;
    
    for(int i=0; i<MAX_STEPS; i++) {
    	vec3 p = ro + rd*dO;
        float dS = GetDist(p);
        dO += dS;
        if(dO>MAX_DIST || abs(dS)<SURF_DIST) break;
    }
    
    return dO;
}

vec3 GetNormal(vec3 p) {
	float d = GetDist(p);
    vec2 e = vec2(.001, 0);
    
    vec3 n = d - vec3(
        GetDist(p-e.xyy),
        GetDist(p-e.yxy),
        GetDist(p-e.yyx));
    
    return normalize(n);
}

vec3 GetRayDir(vec2 uv, vec3 p, vec3 l, float z) {
    vec3 f = normalize(l-p),
        r = normalize(cross(vec3(0,1,0), f)),
        u = cross(f,r),
        c = f*z,
        i = c + uv.x*r + uv.y*u,
        d = normalize(i);
    return d;
}

void main() {
    vec2 uv = (gl_FragCoord.xy-.5*u_resolution.xy)/u_resolution.y;
	vec2 m = u_resolution.xy * 1.0;

    float r = 5.5;
    float time = 0. * u_time;
	float u_time_res = u_time / 4.0;
    vec3 ro = vec3(r * cos(time), 0.1 * u_time_res, r * sin(time));
    //ro.yz *= Rot(-m.y*3.14+1.);
    //ro.xz *= Rot(-m.x*6.2831);
    
    vec3 rd = GetRayDir(uv, ro, vec3(0,0.1 * u_time_res,0), 2.);
    vec3 col = vec3(0);
   
    float d = RayMarch(ro, rd);

    if(d<MAX_DIST) {
        vec3 p = ro + rd * d;
        vec3 n = GetNormal(p);
        vec3 r = reflect(rd, n);

        float ambient = .3;
        float difPower = .4;
        float dif = max(dot(n, normalize(vec3(1,2,3))), 0.);
        col = vec3(dif*difPower + ambient);

        //col *= texture(iChannel0,r).rgb;
        col *= 1. + r.y;//+ p.y;
        col = clamp(col, 0., 1.);
        
        vec3 e = vec3(1.);
        col *= pal(r.y, e, e, e, 0.35 * vec3(0.66,0.66,0.66));
        //col *= 0.5 + 0.5 * thc(4., 12. * length(p) + 0.4 * iTime) * cos(4. * p.y + iTime);
        //col *= 0.5 * (1. + thc(2., iTime + p.y * 4.));
    }

    col = pow(col, vec3(.4545));	// gamma correction
    
    gl_FragColor = vec4(col,col.r);
}