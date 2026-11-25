import { describe, expect, it } from 'vitest';

import { blendLooks, stateLook } from '@/AgentAvatar/look';
import { buildAgentAvatarScene } from '@/AgentAvatar/scene';
import { AGENT_AVATAR_SHAPES, AGENT_AVATAR_STATES } from '@/AgentAvatar/utils';

import { flatten } from '../scripts/agentAvatarPath';

const parse = (transform: string) => transform.slice(7, -1).split(' ').map(Number);
const TILTS = [-3, 3].map((degrees) => (degrees * Math.PI) / 180);

/** Farthest any painted point gets past the 0..100 box, at the steepest seeded tilt. */
const overflow = (scene: ReturnType<typeof buildAgentAvatarScene>) => {
  const rings = new Map(scene.paths.map((path) => [path.id, flatten(path.d).flat()]));
  let worst = -Infinity;
  for (const { href, transform } of scene.body) {
    const m = parse(transform);
    for (const [x, y] of rings.get(href)!) {
      const [px, py] = [m[0] * x + m[2] * y + m[4] - 50, m[1] * x + m[3] * y + m[5] - 50];
      for (const angle of TILTS) {
        const [c, s] = [Math.cos(angle), Math.sin(angle)];
        worst = Math.max(worst, Math.abs(c * px - s * py) - 50, Math.abs(s * px + c * py) - 50);
      }
    }
  }
  return worst;
};

describe('AgentAvatar bounds', () => {
  it('keeps every shape inside its box in every state', () => {
    const offenders: string[] = [];
    for (const shape of AGENT_AVATAR_SHAPES) {
      for (const state of AGENT_AVATAR_STATES) {
        let worst = -Infinity;
        for (let time = 0; time < 7; time += 0.17) {
          const look = blendLooks({ [state]: 1 }, time);
          worst = Math.max(worst, overflow(buildAgentAvatarScene(shape, { look, time })));
        }
        worst = Math.max(
          worst,
          overflow(
            buildAgentAvatarScene(shape, { look: stateLook(state, 0, true), reducedMotion: true }),
          ),
        );
        if (worst > 0) offenders.push(`${shape}/${state}: +${worst.toFixed(2)}`);
      }
    }
    expect(offenders).toEqual([]);
  }, 120_000);
});
