import gray from '@/color/colors/gray';
import { cssVar } from '@/styles/stylex/cssVar.stylex';

import type { AgentAvatarColor, AgentAvatarShape, AgentAvatarState } from './type';

export const AGENT_AVATAR_SHAPES = [
  'lobot',
  'face',
  'cloud',
  'ghost',
  'cat',
  'bear',
  'bunny',
  'frog',
  'robot',
  'star',
  'cookie',
  'pudding',
  'bowl',
  'mug',
  'sprout',
  'bulb',
  'chat',
  'book',
  'magnifier',
  'rocket',
  'shield',
  'tile',
  'hex',
  'capsule',
] as const satisfies readonly AgentAvatarShape[];

export const AGENT_AVATAR_COLORS = [
  'red',
  'volcano',
  'orange',
  'green',
  'cyan',
  'geekblue',
  'purple',
  'magenta',
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
 * Theme color per palette key: the scale step perceptually closest (OKLab) to a bright, saturated
 * mascot palette, one step per appearance. `ink` is the logo's near black: it is still accepted
 * but left out of `AGENT_AVATAR_COLORS`, so the picker and seeds never offer it.
 */
export const AGENT_AVATAR_COLOR_TOKENS: Record<AgentAvatarColor, { dark: string; light: string }> =
  {
    cyan: { dark: cssVar.cyan6, light: cssVar.cyan10 },
    geekblue: { dark: cssVar.geekblue9, light: cssVar.geekblue9 },
    gray: { dark: cssVar.gray9, light: cssVar.gray9 },
    green: { dark: cssVar.green9, light: cssVar.green9 },
    ink: { dark: cssVar.gray7, light: cssVar.gray11 },
    magenta: { dark: cssVar.magenta9, light: cssVar.magenta9 },
    orange: { dark: cssVar.orange9, light: cssVar.orange9 },
    purple: { dark: cssVar.purple9, light: cssVar.purple9 },
    red: { dark: cssVar.red8, light: cssVar.red9 },
    volcano: { dark: cssVar.volcano9, light: cssVar.volcano9 },
  };

/** Logo eyes: white and near black, identical for every color and appearance. */
export const SCLERA_COLOR = cssVar.colorWhite;
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
  /** Resting lean in degrees, an integer from -3 to 3, rotated around the bottom center. */
  tilt: number;
}

/** Shape, color, tilt and animation phase derived from a seed. Pure and deterministic. */
export const getAgentAvatarTraits = (seed: string): AgentAvatarTraits => {
  const hash = hashSeed(`${SEED_SALT}${seed}`);
  return {
    color: AGENT_AVATAR_COLORS[(hash >>> 3) % AGENT_AVATAR_COLORS.length],
    phase: -(((hash >>> 7) % 3000) / 1000),
    shape: AGENT_AVATAR_SHAPES[hash % AGENT_AVATAR_SHAPES.length],
    tilt: ((hash >>> 11) % 7) - 3,
  };
};

export const isAgentAvatarColor = (color: string): color is AgentAvatarColor =>
  Object.hasOwn(AGENT_AVATAR_COLOR_TOKENS, color);
