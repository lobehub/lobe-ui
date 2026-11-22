/**
 * One live frame as plain draw data. `open-bot-avatar` provides the implied volume and the idle
 * breathing, blinking and wander; the state poses come from `look.ts` and the eyes are the Lobot
 * logo eyes.
 */
import { type AvatarFrame, avatarFrame, computePose, type Matrix } from 'open-bot-avatar';

import { drawEye, type EyeDrawing, LOGO_EYE } from './eyes';
import { type AvatarLook, lookMatrix, matrixTransform, REST_GAZE_X, REST_YAW } from './look';
import { getShapeDefinition, SHAPE_GEOMETRY } from './shapes';
import type { AgentAvatarShape } from './type';

export interface SceneUse {
  href: string;
  transform: string;
}

export interface SceneEye extends EyeDrawing {
  transform: string;
}

export interface AgentAvatarScene {
  /** Cross-sections of the body, back to front. */
  body: SceneUse[];
  /** Detached details of the silhouette, drawn on the face plane while it faces the viewer. */
  extra: { d: string; transform: string } | null;
  /** The eyes that face the viewer. */
  eyes: SceneEye[];
  /** Path definitions referenced by `body`. */
  paths: AvatarFrame['paths'];
}

export interface SceneOptions {
  /** Look target from the pointer, with how strongly it applies. */
  gaze?: { weight?: number; x: number; y: number };
  look: AvatarLook;
  reducedMotion?: boolean;
  time?: number;
}

/** The engine's seed for a definition id (FNV-1a), so the eyes follow the pose the body uses. */
export const engineSeed = (id: string) => {
  let hash = 2_166_136_261;
  for (let index = 0; index < id.length; index++) {
    hash ^= id.charCodeAt(index);
    hash = Math.imul(hash, 16_777_619);
  }
  return hash >>> 0;
};

const multiply = (m: readonly number[], n: readonly number[]): Matrix => [
  m[0] * n[0] + m[2] * n[1],
  m[1] * n[0] + m[3] * n[1],
  m[0] * n[2] + m[2] * n[3],
  m[1] * n[2] + m[3] * n[3],
  m[0] * n[4] + m[2] * n[5] + m[4],
  m[1] * n[4] + m[3] * n[5] + m[5],
];

export const buildAgentAvatarScene = (
  shape: AgentAvatarShape,
  { gaze, look, reducedMotion = false, time = 0 }: SceneOptions,
): AgentAvatarScene => {
  const definition = getShapeDefinition(shape);
  const { extra, eyes: placement } = SHAPE_GEOMETRY[shape];
  const follow = gaze?.weight ?? (gaze ? 1 : 0);
  // The engine drops its resting turn while following, so ours fades out with it.
  const view = { pitch: look.pitch, yaw: (1 - follow) * REST_YAW + look.yaw };
  const input = { gaze, reducedMotion, state: 'idle', time, view } as const;
  const frame = avatarFrame(definition, input);
  const pose = computePose({ ...input, seed: engineSeed(definition.id) });
  const root = multiply(lookMatrix(look), frame.root);
  const rx = placement.gap / LOGO_EYE.gap;
  // The pointer wins over a state's own look; the idle gaze rests to the right.
  const gazeMix = look.gazeMix * (1 - follow);
  const restX = pose.gazeX + REST_GAZE_X * (1 - follow);
  const gazeX = restX + (look.gazeX - restX) * gazeMix;
  const gazeY = pose.gazeY + (look.gazeY - pose.gazeY) * gazeMix;

  const scene: AgentAvatarScene = { body: [], extra: null, eyes: [], paths: frame.paths };

  for (const item of frame.shapes) {
    if (item.kind === 'ribbon') continue;
    const transform = matrixTransform(multiply(root, item.matrix));
    if (item.kind === 'slice') {
      scene.body.push({ href: item.path, transform });
    } else {
      const side = item.key === 'eye-0' ? -1 : 1;
      scene.eyes.push({
        ...drawEye(placement.x + (side * placement.gap) / 2, placement.y, rx, side, {
          arc: look.arc,
          blink: pose.blink,
          gazeX,
          gazeY,
          slit: look.slit,
          squint: side === -1 ? look.squintL : look.squintR,
          wide: look.wide,
        }),
        transform,
      });
    }
  }

  if (extra && scene.eyes.length > 0)
    scene.extra = { d: extra, transform: scene.eyes[0].transform };

  return scene;
};
