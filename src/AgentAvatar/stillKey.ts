import { SHAPE_GEOMETRY } from './shapes';
import type { AgentAvatarShape } from './type';

/** Fingerprint of a shape's geometry, so a stale baked still fails the tests. */
export const stillKey = (shape: AgentAvatarShape) => {
  const { d, eyes, extra } = SHAPE_GEOMETRY[shape];
  const text = JSON.stringify([d, eyes.gap, eyes.x, eyes.y, extra ?? '']);
  let hash = 2_166_136_261;
  for (let index = 0; index < text.length; index++) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16_777_619);
  }
  return (hash >>> 0).toString(36);
};
