/**
 * The animated avatar: engine frame loop plus painter. Loaded on demand, so still avatars never
 * pay for the engine.
 */
import { avatarFrame, createAnimator, pointerGaze } from 'open-bot-avatar';
import { requestFrame, subscribeFrames, trackPointer } from 'open-bot-avatar/dom';

import { blendLooks, REST_YAW } from './look';
import { type AgentAvatarLayers, createPainter } from './painter';
import { buildAgentAvatarScene } from './scene';
import { getShapeDefinition, SHAPE_GEOMETRY } from './shapes';
import type { AgentAvatarShape, AgentAvatarState } from './type';

export { requestFrame, trackPointer };

/** Avatars below this width redraw at 30 fps: the difference does not show and lists hold many. */
const SMALL_LIVE_SIZE = 128;
const SMALL_FRAME_SECONDS = 1 / 30 - 0.004;
const VIEW_MARGIN = '100px';
/** Time constant of the ease between two states, seconds. */
const STATE_EASE = 0.11;

export interface LiveAvatarState {
  followPointer: boolean;
  idPrefix: string;
  /** Seconds added to the clock, so avatars of one shape do not move in sync. */
  phase: number;
  shape: AgentAvatarShape;
  state: AgentAvatarState;
}

const warmed = new Set<AgentAvatarShape>();

export const isWarm = (shape: AgentAvatarShape) => warmed.has(shape);

/** Build a shape's volume ahead of its first frame; the engine caches it. */
export const warmShape = (shape: AgentAvatarShape) => {
  if (warmed.has(shape)) return;
  avatarFrame(getShapeDefinition(shape), {
    reducedMotion: true,
    view: { pitch: 0, yaw: REST_YAW },
  });
  warmed.add(shape);
};

/** Paint the first frame synchronously and keep animating until the returned stop is called. */
export const runLiveAvatar = (layers: AgentAvatarLayers, read: () => LiveAvatarState) => {
  const svg = layers.defs.ownerSVGElement!;
  const painter = createPainter(layers, read().idPrefix);
  const animator = createAnimator();
  const weights: Partial<Record<AgentAvatarState, number>> = { [read().state]: 1 };
  let box: DOMRect | null = null;
  let visible = true;
  let last = performance.now();

  const draw = (pointer: { x: number; y: number } | null) => {
    const current = read();
    const now = performance.now();
    const k = 1 - Math.exp(-Math.min(0.1, (now - last) / 1000) / STATE_EASE);
    last = now;
    weights[current.state] ??= 0;
    for (const state of Object.keys(weights) as AgentAvatarState[]) {
      const goal = state === current.state ? 1 : 0;
      const next = weights[state]! + (goal - weights[state]!) * k;
      if (goal === 0 && next < 0.004) delete weights[state];
      else weights[state] = goal === 1 && next > 0.996 ? 1 : next;
    }

    const { y: eyeY } = SHAPE_GEOMETRY[current.shape].eyes;
    const target =
      current.followPointer && pointer && box && box.width > 0
        ? pointerGaze(pointer, box, { x: 0.5, y: eyeY / 100 })
        : null;
    const step = animator.step({ now, reducedMotion: false, state: 'idle', target });
    const time = now / 1000 + current.phase;
    painter.paint(
      buildAgentAvatarScene(current.shape, {
        gaze: step.gaze,
        look: blendLooks(weights, time),
        time,
      }),
    );
  };

  const observer =
    typeof IntersectionObserver === 'undefined'
      ? null
      : new IntersectionObserver(
          (entries) => {
            const next = entries.at(-1)!.isIntersecting;
            if (next === visible) return;
            visible = next;
            if (visible) requestFrame();
          },
          { rootMargin: VIEW_MARGIN },
        );
  observer?.observe(svg);

  // Paint before the browser does, so the still pose hands over without an empty frame.
  draw(null);
  const unsubscribe = subscribeFrames({
    draw: (_time, pointer) => {
      if (!visible) return false;
      draw(pointer);
      return box && box.width > 0 && box.width < SMALL_LIVE_SIZE ? SMALL_FRAME_SECONDS : true;
    },
    measure: () => {
      box = visible ? svg.getBoundingClientRect() : null;
    },
  });

  return () => {
    unsubscribe();
    observer?.disconnect();
    painter.destroy();
  };
};
