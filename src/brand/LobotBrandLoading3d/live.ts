/**
 * The animated loader: the volume engine of `AgentAvatar` driven by the loader's own
 * choreography. Loaded on demand, so the still mark never pays for the engine.
 */
import { requestFrame, subscribeFrames } from 'open-bot-avatar/dom';

import { type AgentAvatarLayers, createPainter } from '@/AgentAvatar/painter';
import { buildAgentAvatarScene } from '@/AgentAvatar/scene';

import { loadingBubbles, loadingLook } from './choreography';

const SVG_NS = 'http://www.w3.org/2000/svg';
/** More volume than an avatar at rest needs, so the head stays round while it turns. */
const DEPTH = 11;
const VIEW_MARGIN = '100px';
const EYE_COLORS = {
  pupil: 'var(--lobe-lobot-loading-pupil)',
  sclera: 'var(--lobe-lobot-loading-sclera)',
};

export interface LobotLoadingLayers extends AgentAvatarLayers {
  bubbles: SVGGElement;
}

const sceneAt = (time: number) =>
  buildAgentAvatarScene('lobot', { depth: DEPTH, look: loadingLook(time), time });

/** Build the volume ahead of the first frame; the engine caches it. */
export const warm = () => {
  sceneAt(0);
};

const round = (value: number) => String(Math.round(value * 100) / 100);

/** Paint the first frame synchronously and keep animating until the returned stop is called. */
export const runLobotLoading = (layers: LobotLoadingLayers, idPrefix: string) => {
  const svg = layers.defs.ownerSVGElement!;
  const painter = createPainter(layers, idPrefix, EYE_COLORS);
  const bubbles = [0, 1].map(() => {
    const circle = document.createElementNS(SVG_NS, 'circle');
    layers.bubbles.append(circle);
    return circle;
  });
  const startedAt = performance.now();
  let visible = true;

  const draw = () => {
    const time = (performance.now() - startedAt) / 1000;
    // The logo's bubbles are drawn by the orbit, not on the face plane.
    painter.paint({ ...sceneAt(time), extra: null });
    for (const [index, { r, x, y }] of loadingBubbles(time).entries()) {
      const circle = bubbles[index];
      circle.setAttribute('cx', round(x));
      circle.setAttribute('cy', round(y));
      circle.setAttribute('r', round(r));
    }
  };

  const observer =
    typeof IntersectionObserver === 'undefined'
      ? null
      : new IntersectionObserver(
          (entries) => {
            visible = entries.at(-1)!.isIntersecting;
            // The shared loop sleeps once nothing draws.
            if (visible) requestFrame();
          },
          { rootMargin: VIEW_MARGIN },
        );
  observer?.observe(svg);

  // Paint before the browser does, so the still mark hands over without an empty frame.
  draw();
  const unsubscribe = subscribeFrames({
    draw: () => {
      if (!visible) return false;
      draw();
      return true;
    },
  });

  return () => {
    unsubscribe();
    observer?.disconnect();
    painter.destroy();
    for (const circle of bubbles) circle.remove();
  };
};
