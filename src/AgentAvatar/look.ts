/**
 * What each state does to the avatar itself: its eyes and a small body pose. Nothing here reaches
 * outside the avatar's own box, so it can sit in a tight layout at any state.
 */
import type { AgentAvatarState } from './type';

export type LookMatrix = [number, number, number, number, number, number];

export interface AvatarLook {
  /** 0 = open eyes, 1 = closed smiling arcs. */
  arc: number;
  /** How much `gazeX` / `gazeY` replace the idle wander, 0..1. */
  gazeMix: number;
  gazeX: number;
  gazeY: number;
  /** Vertical offset (negative = up), viewBox units. */
  lift: number;
  /** Extra view tilt, radians. */
  pitch: number;
  /** In-plane rotation, degrees. */
  roll: number;
  /** Horizontal offset, viewBox units. */
  shift: number;
  /** 0 = open eyes, 1 = heavy lids. */
  slit: number;
  squintL: number;
  squintR: number;
  /** Squash and stretch about the base. */
  sx: number;
  sy: number;
  /** 0 = logo eyes, 1 = wide eyes with small pupils. */
  wide: number;
  /** Extra view turn, radians. */
  yaw: number;
}

/** Cancels the engine's resting turn to the left and leaves the face almost frontal, a touch right. */
export const REST_YAW = 0.38;
/** A slight resting look to the right on top of the logo's inward pupils. */
export const REST_GAZE_X = 0.12;

const NEUTRAL: AvatarLook = {
  arc: 0,
  gazeMix: 0,
  gazeX: 0,
  gazeY: 0,
  lift: 0,
  pitch: 0,
  roll: 0,
  shift: 0,
  slit: 0,
  squintL: 0,
  squintR: 0,
  sx: 1,
  sy: 1,
  wide: 0,
  yaw: 0,
};

const TAU = Math.PI * 2;
const wave = (t: number, period: number, phase = 0) => Math.sin((TAU * t) / period + phase);
const fract = (value: number) => value - Math.floor(value);
const smooth = (value: number) => {
  const x = Math.min(1, Math.max(0, value));
  return x * x * (3 - 2 * x);
};

/** Where a working avatar's eyes go next: mostly down, across the work. */
const WORK_GLANCES: [number, number][] = [
  [-0.55, 0.45],
  [0.15, 0.55],
  [0.65, 0.35],
  [-0.1, 0.55],
  [0.4, 0.45],
];
const GLANCE_SECONDS = 0.62;

const glance = (t: number): [number, number] => {
  const slot = Math.floor(t / GLANCE_SECONDS);
  const count = WORK_GLANCES.length;
  const from = WORK_GLANCES[(((slot - 1) % count) + count) % count];
  const to = WORK_GLANCES[((slot % count) + count) % count];
  const k = smooth(fract(t / GLANCE_SECONDS) / 0.2);
  return [from[0] + (to[0] - from[0]) * k, from[1] + (to[1] - from[1]) * k];
};

/** The look of a state `t` seconds in. `still` is its calm pose, for avatars that do not move. */
export const stateLook = (state: AgentAvatarState, t: number, still = false): AvatarLook => {
  switch (state) {
    case 'working': {
      if (still) {
        return { ...NEUTRAL, gazeMix: 1, gazeX: 0.2, gazeY: 0.5, squintL: 0.2, squintR: 0.2 };
      }
      const beat = wave(t, 0.7);
      const [gazeX, gazeY] = glance(t);
      return {
        ...NEUTRAL,
        gazeMix: 1,
        gazeX,
        gazeY,
        lift: -0.5 * (0.5 + 0.5 * beat),
        pitch: -0.05,
        roll: 1.6 + 0.5 * beat,
        squintL: 0.22,
        squintR: 0.22,
        sx: 1.004 + 0.004 * beat,
        sy: 0.992 - 0.006 * beat,
      };
    }
    case 'waiting': {
      if (still) return { ...NEUTRAL, gazeMix: 1, gazeX: 0.45, gazeY: 0.08, roll: 3, slit: 1 };
      const sigh = Math.sin(TAU * Math.min(1, fract(t / 6.5) / 0.33));
      return {
        ...NEUTRAL,
        gazeMix: 1,
        gazeX: 0.45 + 0.12 * wave(t, 8.2),
        gazeY: 0.08,
        roll: 3 + 0.7 * wave(t, 6.4, 2),
        slit: 1,
        sx: 1 - 0.01 * sigh,
        sy: 1 + 0.018 * sigh,
      };
    }
    case 'thinking': {
      if (still) {
        return {
          ...NEUTRAL,
          gazeMix: 1,
          gazeX: 0.55,
          gazeY: -0.75,
          roll: -3,
          squintL: 0.12,
          squintR: 0.28,
        };
      }
      return {
        ...NEUTRAL,
        gazeMix: 1,
        gazeX: 0.5 + 0.24 * wave(t, 5.6),
        gazeY: -0.72,
        lift: -0.4 * (1 - Math.cos((TAU * t) / 5.2)),
        pitch: 0.06,
        roll: -3 + 0.8 * wave(t, 4.1),
        squintL: 0.12,
        squintR: 0.28 + 0.08 * wave(t, 3.1),
        yaw: 0.06,
      };
    }
    case 'blocked': {
      if (still) return { ...NEUTRAL, gazeMix: 1, gazeY: 0.05, wide: 1 };
      const p = fract(t / 2.2);
      const shaking = p < 0.22 ? p / 0.22 : 0;
      return {
        ...NEUTRAL,
        gazeMix: 1,
        gazeY: 0.05,
        shift: shaking ? 1.6 * Math.sin(TAU * 3 * shaking) * (1 - shaking) : 0,
        sx: 0.994,
        sy: 1.012,
        wide: 1,
      };
    }
    case 'done': {
      if (still) return { ...NEUTRAL, arc: 1 };
      // Two small hops, then a contented rest.
      const p = fract(t / 2.6);
      const hopping = p < 0.44;
      const hop = hopping ? fract(p / 0.22) : 0;
      const air = hopping ? 4 * hop * (1 - hop) : 0;
      const land = hopping ? Math.max(0, 1 - Math.min(hop, 1 - hop) / 0.14) : 0;
      return {
        ...NEUTRAL,
        arc: 1,
        lift: -2.6 * air,
        roll: hopping ? 2.6 * Math.sin((TAU * p) / 0.44) : 0.8 * wave(t, 3.2),
        sx: 1 + 0.05 * land - 0.012 * air,
        sy: 1 - 0.07 * land + 0.022 * air,
      };
    }
    default: {
      return NEUTRAL;
    }
  }
};

/** The weighted mean of the looks of the states being eased between. */
export const blendLooks = (
  weights: Partial<Record<AgentAvatarState, number>>,
  t: number,
): AvatarLook => {
  const entries = Object.entries(weights) as [AgentAvatarState, number][];
  const total = entries.reduce((sum, [, weight]) => sum + weight, 0) || 1;
  const mixed = Object.fromEntries(
    Object.keys(NEUTRAL).map((key) => [key, 0]),
  ) as unknown as Record<keyof AvatarLook, number>;
  for (const [state, weight] of entries) {
    const look = stateLook(state, t);
    for (const key of Object.keys(mixed) as (keyof AvatarLook)[]) {
      mixed[key] += (look[key] * weight) / total;
    }
  }
  return mixed;
};

/** The body pose of a look: squash about the base, roll about the middle, then the offsets. */
export const lookMatrix = ({ lift, roll, shift, sx, sy }: AvatarLook): LookMatrix => {
  const angle = (roll * Math.PI) / 180;
  const [cos, sin] = [Math.cos(angle), Math.sin(angle)];
  const [px, py] = [50, 52];
  // Squash about (50, 90).
  const [a, d] = [sx, sy];
  const e = 50 - 50 * sx;
  const f = 90 - 90 * sy;
  return [
    cos * a,
    sin * a,
    -sin * d,
    cos * d,
    cos * (e - px) - sin * (f - py) + px + shift,
    sin * (e - px) + cos * (f - py) + py + lift,
  ];
};

export const matrixTransform = (m: readonly number[]) =>
  `matrix(${m
    .map((value, index) => {
      const scale = index < 4 ? 10_000 : 100;
      return Math.round(value * scale) / scale;
    })
    .join(' ')})`;
