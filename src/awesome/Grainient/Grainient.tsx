'use client';

import { cx, useThemeMode } from 'antd-style';
import { memo, useEffect, useRef } from 'react';

import { styles } from './style';
import type { GrainientProps } from './type';

const VERTEX_SHADER = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uTimeSpeed;
uniform float uColorBalance;
uniform float uWarpStrength;
uniform float uWarpFrequency;
uniform float uWarpSpeed;
uniform float uWarpAmplitude;
uniform float uBlendAngle;
uniform float uBlendSoftness;
uniform float uRotationAmount;
uniform float uNoiseScale;
uniform float uGrainAmount;
uniform float uGrainScale;
uniform float uGrainAnimated;
uniform float uContrast;
uniform float uGamma;
uniform float uSaturation;
uniform vec2 uCenterOffset;
uniform float uZoom;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform float uLightMode;
out vec4 fragColor;
#define S(a,b,t) smoothstep(a,b,t)
mat2 Rot(float a){float s=sin(a),c=cos(a);return mat2(c,-s,s,c);}
vec2 hash(vec2 p){p=vec2(dot(p,vec2(2127.1,81.17)),dot(p,vec2(1269.5,283.37)));return fract(sin(p)*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);float n=mix(mix(dot(-1.0+2.0*hash(i+vec2(0.0,0.0)),f-vec2(0.0,0.0)),dot(-1.0+2.0*hash(i+vec2(1.0,0.0)),f-vec2(1.0,0.0)),u.x),mix(dot(-1.0+2.0*hash(i+vec2(0.0,1.0)),f-vec2(0.0,1.0)),dot(-1.0+2.0*hash(i+vec2(1.0,1.0)),f-vec2(1.0,1.0)),u.x),u.y);return 0.5+0.5*n;}
void mainImage(out vec4 o, vec2 C){
  float t=iTime*uTimeSpeed;
  vec2 uv=C/iResolution.xy;
  float ratio=iResolution.x/iResolution.y;
  vec2 tuv=uv-0.5+uCenterOffset;
  tuv/=max(uZoom,0.001);

  float degree=noise(vec2(t*0.1,tuv.x*tuv.y)*uNoiseScale);
  tuv.y*=1.0/ratio;
  tuv*=Rot(radians((degree-0.5)*uRotationAmount+180.0));
  tuv.y*=ratio;

  float frequency=uWarpFrequency;
  float ws=max(uWarpStrength,0.001);
  float amplitude=uWarpAmplitude/ws;
  float warpTime=t*uWarpSpeed;
  tuv.x+=sin(tuv.y*frequency+warpTime)/amplitude;
  tuv.y+=sin(tuv.x*(frequency*1.5)+warpTime)/(amplitude*0.5);

  vec3 colLav=uColor1;
  vec3 colOrg=uColor2;
  vec3 colDark=uColor3;
  float b=uColorBalance;
  float s=max(uBlendSoftness,0.0);
  mat2 blendRot=Rot(radians(uBlendAngle));
  float blendX=(tuv*blendRot).x;
  float edge0=-0.3-b-s;
  float edge1=0.2-b+s;
  float v0=0.5-b+s;
  float v1=-0.3-b-s;
  vec3 layer1=mix(colDark,colOrg,S(edge0,edge1,blendX));
  vec3 layer2=mix(colOrg,colLav,S(edge0,edge1,blendX));
  vec3 col=mix(layer1,layer2,S(v0,v1,tuv.y));

  vec2 grainUv=uv*max(uGrainScale,0.001);
  if(uGrainAnimated>0.5){grainUv+=vec2(iTime*0.05);}
  float grain=fract(sin(dot(grainUv,vec2(12.9898,78.233)))*43758.5453);
  col+=(grain-0.5)*uGrainAmount;

  col=(col-0.5)*uContrast+0.5;
  float luma=dot(col,vec3(0.2126,0.7152,0.0722));
  col=mix(vec3(luma),col,uSaturation);
  col=pow(max(col,0.0),vec3(1.0/max(uGamma,0.001)));
  col=clamp(col,0.0,1.0);
  if(uLightMode>0.5){
    float energy=max(max(col.r,col.g),col.b);
    vec3 hue=col/max(energy,0.001);
    float chroma=length(col-vec3(dot(col,vec3(0.333333))));
    float coverage=clamp(0.12+chroma*1.15+energy*0.18,0.0,0.88);
    col=mix(vec3(1.0),clamp(hue*0.58+col*0.18,0.0,1.0),coverage);
  }

  o=vec4(col,1.0);
}
void main(){
  vec4 o=vec4(0.0);
  mainImage(o,gl_FragCoord.xy);
  fragColor=o;
}
`;

export const hexToRgb = (hex: string): [number, number, number] => {
  let value = hex.trim().replace('#', '');
  if (value.length === 3) value = [...value].map((c) => c + c).join('');
  const result = /^([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(value);
  if (!result) return [1, 1, 1];
  return [
    Number.parseInt(result[1], 16) / 255,
    Number.parseInt(result[2], 16) / 255,
    Number.parseInt(result[3], 16) / 255,
  ];
};

const compile = (gl: WebGL2RenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
};

/**
 * Animated grainy gradient (WebGL2, no extra dependency). Fills its nearest positioned ancestor,
 * pauses when off-screen or the tab is hidden, and draws one still frame when reduced motion is
 * preferred. Without WebGL2 it renders nothing, so give the parent a fallback background.
 */
const Grainient = memo<GrainientProps>(
  ({
    timeSpeed = 0.25,
    colorBalance = 0,
    warpStrength = 1,
    warpFrequency = 5,
    warpSpeed = 2,
    warpAmplitude = 50,
    blendAngle = 0,
    blendSoftness = 0.05,
    rotationAmount = 500,
    noiseScale = 2,
    grainAmount = 0.1,
    grainScale = 2,
    contrast = 1.5,
    gamma = 1,
    saturation = 1,
    zoom = 0.9,
    centerX = 0,
    centerY = 0,
    color1 = '#FF9FFC',
    color2 = '#5227FF',
    color3 = '#B497CF',
    grainAnimated = false,
    lightMode = false,
    className,
    ...rest
  }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const drawRef = useRef<(() => void) | null>(null);
    const uniformsRef = useRef<(() => void) | null>(null);
    const { isDarkMode } = useThemeMode();
    const light = lightMode === 'auto' ? !isDarkMode : lightMode;

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2', { alpha: true, antialias: false });
      if (!gl) return;
      container.append(canvas);

      const vs = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
      const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
      const program = gl.createProgram();
      if (!vs || !fs || !program) {
        canvas.remove();
        return;
      }
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        canvas.remove();
        return;
      }
      gl.useProgram(program);

      // One triangle that covers the viewport.
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const position = gl.getAttribLocation(program, 'position');
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

      const loc = (name: string) => gl.getUniformLocation(program, name);
      const uTime = loc('iTime');
      const uRes = loc('iResolution');
      const started = performance.now();

      const draw = () => {
        gl.uniform1f(uTime, (performance.now() - started) * 0.001);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      };
      drawRef.current = draw;
      uniformsRef.current?.();

      const setSize = () => {
        const rect = container.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.max(1, Math.floor(rect.width * dpr));
        canvas.height = Math.max(1, Math.floor(rect.height * dpr));
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(uRes, canvas.width, canvas.height);
        draw();
      };

      const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)');
      let raf = 0;
      let inView = true;

      const loop = () => {
        draw();
        raf = requestAnimationFrame(loop);
      };
      const stop = () => {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
      };
      const sync = () => {
        const run = inView && !document.hidden && !reducedMotion?.matches;
        if (run && !raf) raf = requestAnimationFrame(loop);
        if (!run) {
          stop();
          draw();
        }
      };

      const resizeObserver = new ResizeObserver(setSize);
      resizeObserver.observe(container);
      const intersectionObserver = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        sync();
      });
      intersectionObserver.observe(container);
      document.addEventListener('visibilitychange', sync);
      reducedMotion?.addEventListener('change', sync);
      setSize();
      sync();

      return () => {
        stop();
        resizeObserver.disconnect();
        intersectionObserver.disconnect();
        document.removeEventListener('visibilitychange', sync);
        reducedMotion?.removeEventListener('change', sync);
        drawRef.current = null;
        gl.deleteBuffer(buffer);
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        canvas.remove();
      };
    }, []);

    useEffect(() => {
      const apply = () => {
        const canvas = containerRef.current?.querySelector('canvas');
        const gl = canvas?.getContext('webgl2');
        if (!gl) return;
        const program = gl.getParameter(gl.CURRENT_PROGRAM) as WebGLProgram | null;
        if (!program) return;
        const loc = (name: string) => gl.getUniformLocation(program, name);
        gl.uniform1f(loc('uTimeSpeed'), timeSpeed);
        gl.uniform1f(loc('uColorBalance'), colorBalance);
        gl.uniform1f(loc('uWarpStrength'), warpStrength);
        gl.uniform1f(loc('uWarpFrequency'), warpFrequency);
        gl.uniform1f(loc('uWarpSpeed'), warpSpeed);
        gl.uniform1f(loc('uWarpAmplitude'), warpAmplitude);
        gl.uniform1f(loc('uBlendAngle'), blendAngle);
        gl.uniform1f(loc('uBlendSoftness'), blendSoftness);
        gl.uniform1f(loc('uRotationAmount'), rotationAmount);
        gl.uniform1f(loc('uNoiseScale'), noiseScale);
        gl.uniform1f(loc('uGrainAmount'), grainAmount);
        gl.uniform1f(loc('uGrainScale'), grainScale);
        gl.uniform1f(loc('uContrast'), contrast);
        gl.uniform1f(loc('uGamma'), gamma);
        gl.uniform1f(loc('uSaturation'), saturation);
        gl.uniform1f(loc('uZoom'), zoom);
        gl.uniform1f(loc('uGrainAnimated'), grainAnimated ? 1 : 0);
        gl.uniform1f(loc('uLightMode'), light ? 1 : 0);
        gl.uniform2f(loc('uCenterOffset'), centerX, centerY);
        gl.uniform3f(loc('uColor1'), ...hexToRgb(color1));
        gl.uniform3f(loc('uColor2'), ...hexToRgb(color2));
        gl.uniform3f(loc('uColor3'), ...hexToRgb(color3));
        drawRef.current?.();
      };
      uniformsRef.current = apply;
      apply();
    }, [
      timeSpeed,
      colorBalance,
      warpStrength,
      warpFrequency,
      warpSpeed,
      warpAmplitude,
      blendAngle,
      blendSoftness,
      rotationAmount,
      noiseScale,
      grainAmount,
      grainScale,
      contrast,
      gamma,
      saturation,
      zoom,
      centerX,
      centerY,
      color1,
      color2,
      color3,
      grainAnimated,
      light,
    ]);

    return <div aria-hidden className={cx(styles.root, className)} ref={containerRef} {...rest} />;
  },
);

Grainient.displayName = 'Grainient';

export default Grainient;
