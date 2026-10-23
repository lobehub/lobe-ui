import gray from '@/color/colors/gray';
import orange from '@/color/colors/orange';
import { cssVar } from '@/styles/stylex/cssVar.stylex';

import type { AgentAvatarColor, AgentAvatarShape, AgentAvatarState } from './type';

export const AGENT_AVATAR_SHAPES = [
  'face',
  'bowl',
  'cloud',
  'tile',
  'hex',
  'shield',
  'pudding',
  'cookie',
  'star',
  'capsule',
  'ghost',
  'cat',
] as const satisfies readonly AgentAvatarShape[];

export const AGENT_AVATAR_COLORS = [
  'purple',
  'orange',
  'geekblue',
  'volcano',
  'magenta',
  'ink',
  'gray',
] as const satisfies readonly AgentAvatarColor[];

export const AGENT_AVATAR_STATES = [
  'idle',
  'working',
  'waiting',
  'blocked',
  'thinking',
  'done',
] as const satisfies readonly AgentAvatarState[];

/**
 * Theme color per palette key, one scale step per appearance. The dark steps are lifted so the
 * body keeps at least 3:1 against the dark container background; `ink` and `gray` cannot reuse
 * their light step there because the neutral scale flips to near-white in dark mode.
 */
export const AGENT_AVATAR_COLOR_TOKENS: Record<AgentAvatarColor, { dark: string; light: string }> =
  {
    geekblue: { dark: cssVar.geekblue9, light: cssVar.geekblue8 },
    gray: { dark: cssVar.gray10, light: cssVar.gray9 },
    ink: { dark: cssVar.gray7, light: cssVar.gray11 },
    magenta: { dark: cssVar.magenta9, light: cssVar.magenta8 },
    orange: { dark: cssVar.orange9, light: cssVar.orange9 },
    purple: { dark: cssVar.purple9, light: cssVar.purple8 },
    volcano: { dark: cssVar.volcano9, light: cssVar.volcano8 },
  };

/** Logo eyes: warm white and near black, identical for every color and appearance. */
export const SCLERA_COLOR = orange.light[2];
export const PUPIL_COLOR = gray.light[12];

const SEED_SALT = 'lh3174:';

/** FNV-1a followed by the murmur3 finalizer: cheap, deterministic and well spread. */
export const hashSeed = (seed: string) => {
  let hash = 2_166_136_261;
  for (let index = 0; index < seed.length; index++) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16_777_619);
  }
  hash ^= hash >>> 16;
  hash = Math.imul(hash, 0x85_EB_CA_6B);
  hash ^= hash >>> 13;
  hash = Math.imul(hash, 0xC2_B2_AE_35);
  hash ^= hash >>> 16;
  return hash >>> 0;
};

export interface AgentAvatarTraits {
  color: AgentAvatarColor;
  /** Animation offset in seconds (negative), so a list of avatars does not blink in sync. */
  phase: number;
  shape: AgentAvatarShape;
}

/** Shape, color and animation phase derived from a seed. Pure and deterministic. */
export const getAgentAvatarTraits = (seed: string): AgentAvatarTraits => {
  const hash = hashSeed(`${SEED_SALT}${seed}`);
  return {
    color: AGENT_AVATAR_COLORS[(hash >>> 3) % AGENT_AVATAR_COLORS.length],
    phase: -(((hash >>> 7) % 3000) / 1000),
    shape: AGENT_AVATAR_SHAPES[hash % AGENT_AVATAR_SHAPES.length],
  };
};

export const isAgentAvatarColor = (color: string): color is AgentAvatarColor =>
  (AGENT_AVATAR_COLORS as readonly string[]).includes(color);

/** Pupil / sclera radius ratio. */
export const PUPIL_RATIO = 0.6;
/** Smaller pupils at sidebar sizes keep a visible ring of white. */
export const PUPIL_RATIO_SMALL = 0.5;
export const SMALL_SIZE = 24;

/** Motion values are authored for a sclera radius of 14.5 and scaled per shape. */
export const GAZE_UNIT_RADIUS = 14.5;

/**
 * Still pose of the pupils per state, in gaze units. `thinking` looks up but keeps a band of
 * white above the pupil (the keyframes in `style.ts` use the same bound).
 */
export const STILL_GAZE: Record<AgentAvatarState, [number, number]> = {
  blocked: [0, 0],
  done: [0, 0],
  idle: [0, 1.6],
  thinking: [1.8, -3.1],
  waiting: [0, 1.4],
  working: [-2, 3.4],
};

/** `blocked` widens the eyes and shrinks the pupils. */
export const BLOCKED_SCLERA_SCALE = 1.1;
export const BLOCKED_PUPIL_RATIO = 0.36;
