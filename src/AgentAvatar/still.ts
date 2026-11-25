/**
 * The still avatar, drawn from the baked table: no volume engine, so it is cheap to render in long
 * lists and on the server.
 */
import { drawEye, type EyeDrawing, LOGO_EYE } from './eyes';
import { lookMatrix, matrixTransform, REST_GAZE_X, stateLook } from './look';
import { SHAPE_GEOMETRY } from './shapes';
import { AGENT_AVATAR_STILLS } from './stills.generated';
import type { AgentAvatarShape, AgentAvatarState } from './type';

export interface AgentAvatarStill {
  /** The projected body silhouette at rest. */
  d: string;
  /** Face-plane transforms of the left and right eye. */
  eyes: readonly string[];
  /** Fingerprint of the geometry this entry was baked from. */
  key: string;
}

export interface StillScene {
  /** Body silhouette. */
  body: string;
  extra: { d: string; transform: string } | null;
  eyes: (EyeDrawing & { transform: string })[];
  /** The state's body pose. */
  stage: string;
}

export const buildStillScene = (shape: AgentAvatarShape, state: AgentAvatarState): StillScene => {
  const still = AGENT_AVATAR_STILLS[shape];
  const { extra, eyes } = SHAPE_GEOMETRY[shape];
  const look = stateLook(state, 0, true);
  const rx = eyes.gap / LOGO_EYE.gap;
  const gazeX = look.gazeMix ? look.gazeX : REST_GAZE_X;

  return {
    body: still.d,
    extra: extra ? { d: extra, transform: still.eyes[0] } : null,
    eyes: ([-1, 1] as const).map((side, index) => ({
      ...drawEye(eyes.x + (side * eyes.gap) / 2, eyes.y, rx, side, {
        arc: look.arc,
        blink: 0,
        gazeX,
        gazeY: look.gazeY,
        slit: look.slit,
        squint: side === -1 ? look.squintL : look.squintR,
        wide: look.wide,
      }),
      transform: still.eyes[index],
    })),
    stage: matrixTransform(lookMatrix(look)),
  };
};
