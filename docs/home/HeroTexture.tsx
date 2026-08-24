import { useEffect, useRef, useState } from 'react';

import { styles } from './heroTextureStyle';

const VERTEX_SHADER = `#version 300 es
in vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;

uniform vec2 uRes;
uniform float uTime;
uniform vec3 uStopA;
uniform vec3 uStopB;
uniform vec3 uStopC;

out vec4 fragColor;

float hash(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 4; i++) {
    value += amplitude * noise(p);
    p = mat2(0.8, 0.6, -0.6, 0.8) * p * 2.0 + vec2(3.7, 1.3);
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = vec2(uv.x * uRes.x / uRes.y, uv.y);

  float t = uTime * 0.05;

  vec2 q = vec2(fbm(p * 1.4 + t * 0.35), fbm(p * 1.4 - t * 0.28 + 5.2));
  vec2 r = vec2(
    fbm(p * 1.4 + 2.6 * q + vec2(1.7, 9.2) + t * 0.18),
    fbm(p * 1.4 + 2.6 * q + vec2(8.3, 2.8) - t * 0.12)
  );
  float field = fbm(p * 1.4 + 2.6 * r);

  vec3 color = mix(uStopA, uStopB, clamp(field * field * 2.4, 0.0, 1.0));
  color = mix(color, uStopC, clamp(dot(q, vec2(0.7)) - 0.25, 0.0, 1.0));

  float fade = smoothstep(0.02, 0.85, uv.y);
  float alpha = fade * fade * 0.45 * smoothstep(0.14, 0.66, field);

  fragColor = vec4(color * alpha, alpha);
}`;

type RgbStops = [number[], number[], number[]];

const parseSpectralStops = (): RgbStops | null => {
  const value = getComputedStyle(document.documentElement).getPropertyValue(
    '--docs-gradient-spectral',
  );
  const hexes = value.match(/#[0-9a-f]{6}/gi);
  if (!hexes || hexes.length < 3) return null;
  const channel = (hex: string, offset: number) =>
    parseInt(hex.slice(offset, offset + 2), 16) / 255;
  return [
    [channel(hexes[0], 1), channel(hexes[0], 3), channel(hexes[0], 5)],
    [channel(hexes[1], 1), channel(hexes[1], 3), channel(hexes[1], 5)],
    [channel(hexes[2], 1), channel(hexes[2], 3), channel(hexes[2], 5)],
  ];
};

export const HeroTexture = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [canvasEpoch, setCanvasEpoch] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    let frameId = 0;
    let inView = true;
    let readySent = false;
    let drawFrame: ((seconds: number) => void) | null = null;
    let refreshPalette: (() => void) | null = null;
    let sizeAndDraw: (() => boolean) | null = null;
    let destroyResources: ((lose: boolean) => void) | null = null;

    const buildResources = () => {
      const gl = canvas.getContext('webgl2', {
        alpha: true,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: 'low-power',
      });
      if (!gl) return false;

      const compileShader = (type: number, source: string) => {
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

      const vertexShader = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER);
      const fragmentShader = compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
      if (!vertexShader || !fragmentShader) return false;

      const program = gl.createProgram();
      if (!program) return false;
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        gl.deleteProgram(program);
        return false;
      }
      gl.useProgram(program);

      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const position = gl.getAttribLocation(program, 'aPos');
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

      const timeLocation = gl.getUniformLocation(program, 'uTime');
      const stopLocations = ['uStopA', 'uStopB', 'uStopC'].map((name) =>
        gl.getUniformLocation(program, name),
      );

      refreshPalette = () => {
        const stops = parseSpectralStops();
        if (!stops) return;
        stops.forEach((stop, index) => {
          const location = stopLocations[index];
          if (location) gl.uniform3f(location, stop[0], stop[1], stop[2]);
        });
      };
      refreshPalette();

      drawFrame = (seconds: number) => {
        gl.uniform1f(timeLocation, seconds);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        if (!readySent) {
          readySent = true;
          setReady(true);
        }
      };

      sizeAndDraw = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        const width = Math.max(1, Math.round(canvas.clientWidth * dpr));
        const height = Math.max(1, Math.round(canvas.clientHeight * dpr));
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
          gl.viewport(0, 0, width, height);
        }
        return canvas.clientWidth > 0 && drawFrame !== null;
      };

      destroyResources = (lose: boolean) => {
        gl.deleteBuffer(buffer);
        gl.deleteProgram(program);
        drawFrame = null;
        refreshPalette = null;
        sizeAndDraw = null;
        destroyResources = null;
        if (lose) gl.getExtension('WEBGL_lose_context')?.loseContext();
      };

      return true;
    };

    if (!buildResources()) return undefined;

    const renderOnce = () => {
      if (!sizeAndDraw?.()) return;
      drawFrame?.(performance.now() / 1000);
    };

    const syncLoop = (milliseconds: number) => {
      frameId = requestAnimationFrame(syncLoop);
      if (sizeAndDraw?.()) drawFrame?.(milliseconds / 1000);
    };

    const updateLoop = () => {
      const shouldAnimate =
        inView && !document.hidden && !reducedMotion.matches && drawFrame !== null;

      if (shouldAnimate) {
        if (frameId === 0) frameId = requestAnimationFrame(syncLoop);
        return;
      }

      if (frameId !== 0) {
        cancelAnimationFrame(frameId);
        frameId = 0;
      }

      if (!document.hidden) renderOnce();
    };

    const resizeObserver = new ResizeObserver(() => {
      if (frameId === 0) renderOnce();
    });
    resizeObserver.observe(canvas);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      updateLoop();
    });
    intersectionObserver.observe(canvas);

    const handleVisibilityChange = () => updateLoop();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const handleMotionPreferenceChange = () => updateLoop();
    reducedMotion.addEventListener('change', handleMotionPreferenceChange);

    const themeObserver = new MutationObserver(() => {
      refreshPalette?.();
      if (frameId === 0) renderOnce();
    });
    themeObserver.observe(document.documentElement, {
      attributeFilter: ['data-theme'],
      attributes: true,
    });

    const handleContextLost = (event: Event) => {
      event.preventDefault();
      if (frameId !== 0) {
        cancelAnimationFrame(frameId);
        frameId = 0;
      }
      setCanvasEpoch((value) => value + 1);
    };
    canvas.addEventListener('webglcontextlost', handleContextLost);

    updateLoop();

    return () => {
      if (frameId !== 0) cancelAnimationFrame(frameId);
      frameId = 0;
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      themeObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      reducedMotion.removeEventListener('change', handleMotionPreferenceChange);
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      if (!canvas.isConnected) destroyResources?.(true);
      else destroyResources?.(false);
    };
  }, [canvasEpoch]);

  return (
    <div aria-hidden className={styles.heroTexture} data-ready={ready ? '' : undefined}>
      <canvas key={canvasEpoch} ref={canvasRef} />
    </div>
  );
};
