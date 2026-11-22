/**
 * The eyes of the Lobot logo as geometry: tall white ovals with large black pupils that sit toward
 * the nose and a little low. All ratios are measured from the logo SVG (eye 41 × 47, pupil
 * 21.5 × 24, eye centers 105 apart, pupils 7 in and 7 down).
 */
export const LOGO_EYE = {
  /** Eye height / width. */
  aspect: 47 / 41,
  /** Distance between eye centers / eye x-radius. */
  gap: 105 / 41,
  /** Resting pupil offset toward the nose / eye x-radius. */
  lookIn: 7 / 41,
  /** Resting pupil offset downward / eye y-radius. */
  lookDown: 7 / 47,
  /** Pupil x-radius / eye x-radius. */
  pupilX: 21.5 / 41,
  /** Pupil y-radius / eye y-radius. */
  pupilY: 24 / 47,
} as const;

/** How much of the free space inside the eye white the pupil may use. */
const PUPIL_TRAVEL = 0.9;
/** How far the lid comes down at a full `slit` look, as a share of the eye height. */
const LID_DROP = 0.46;
/** The eye never renders thinner than this share of its height, so a blink stays visible. */
const MIN_OPEN = 0.09;
const SMILE_STROKE = 0.5;
/** At a full `wide` look the eye grows by this share and the pupil shrinks to this share. */
const WIDE_EYE = 0.1;
const WIDE_PUPIL = 0.6;

const round = (value: number) => Math.round(value * 100) / 100;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/** An ellipse, optionally with everything above `cutY` removed. `null` when nothing is left. */
export const ellipsePath = (cx: number, cy: number, rx: number, ry: number, cutY?: number) => {
  if (cutY === undefined || cutY <= cy - ry) {
    return `M${round(cx - rx)} ${round(cy)}A${round(rx)} ${round(ry)} 0 1 1 ${round(cx + rx)} ${round(cy)}A${round(rx)} ${round(ry)} 0 1 1 ${round(cx - rx)} ${round(cy)}Z`;
  }
  if (cutY >= cy + ry) return null;
  const half = rx * Math.sqrt(1 - ((cutY - cy) / ry) ** 2);
  return `M${round(cx - half)} ${round(cutY)}A${round(rx)} ${round(ry)} 0 ${cutY < cy ? 1 : 0} 0 ${round(cx + half)} ${round(cutY)}Z`;
};

export interface EyePose {
  /** 0 = open eye, 1 = closed happy arc. */
  arc: number;
  /** 0 = open, 1 = closed. */
  blink: number;
  /** Look direction, -1..1 per axis. */
  gazeX: number;
  gazeY: number;
  /** 0 = open eye, 1 = heavy lid of a waiting avatar. */
  slit: number;
  /** Extra narrowing of this eye, 0..1. */
  squint: number;
  /** 0 = logo eyes, 1 = wide eyes with small pupils (`blocked`). */
  wide?: number;
}

export interface EyeDrawing {
  /** Pupil outline, absent while the eye is closed into an arc. */
  pupil: string | null;
  /** Eye white outline, absent while the eye is closed into an arc. */
  sclera: string | null;
  /** Closed smiling arc. */
  smile: string | null;
  /** Stroke width of `smile`. */
  smileWidth: number;
}

/**
 * Draw one eye in its face plane. `side` is -1 for the left eye and 1 for the right. A change to
 * or from the happy arc closes the open eye first and then draws the arc.
 */
export const drawEye = (
  cx: number,
  cy: number,
  baseRx: number,
  side: -1 | 1,
  pose: EyePose,
): EyeDrawing => {
  const wide = clamp(pose.wide ?? 0, 0, 1);
  const rx = baseRx * (1 + WIDE_EYE * wide);
  const ry = rx * LOGO_EYE.aspect;
  const arc = clamp(pose.arc, 0, 1);

  if (arc >= 0.5) {
    const k = (arc - 0.5) * 2;
    const halfWidth = rx * 0.82;
    return {
      pupil: null,
      sclera: null,
      smile: `M${round(cx - halfWidth)} ${round(cy + ry * 0.24)}Q${round(cx)} ${round(cy + ry * (0.24 - 0.92 * k))} ${round(cx + halfWidth)} ${round(cy + ry * 0.24)}`,
      smileWidth: round(rx * SMILE_STROKE),
    };
  }

  const open = Math.max(
    MIN_OPEN,
    (1 - clamp(pose.blink, 0, 1)) * (1 - clamp(pose.squint, 0, 1) * 0.4) * (1 - arc * 2),
  );
  const openRy = ry * open;
  // Lids close toward a point a little below the center, as in the logo's low gaze.
  const eyeY = cy + (ry - openRy) * 0.18;
  const slit = clamp(pose.slit, 0, 1);
  const cutY = slit > 0 ? eyeY - openRy + 2 * openRy * LID_DROP * slit : undefined;

  const pupilScale = 1 + (WIDE_PUPIL - 1) * wide;
  const pupilRx = rx * LOGO_EYE.pupilX * pupilScale;
  const pupilRy = openRy * LOGO_EYE.pupilY * pupilScale;
  const freeX = rx - pupilRx;
  const freeY = openRy - pupilRy;
  let dx = -side * rx * LOGO_EYE.lookIn * (1 - wide) + pose.gazeX * freeX * PUPIL_TRAVEL;
  let dy = openRy * LOGO_EYE.lookDown * (1 - wide) + pose.gazeY * freeY * PUPIL_TRAVEL;
  // Keep the whole pupil inside the eye white, whatever the resting offset and gaze add up to.
  const reach = Math.hypot(dx / freeX, dy / Math.max(freeY, 0.01));
  if (reach > PUPIL_TRAVEL) {
    dx *= PUPIL_TRAVEL / reach;
    dy *= PUPIL_TRAVEL / reach;
  }

  return {
    pupil: ellipsePath(cx + dx, eyeY + dy, pupilRx, pupilRy, cutY),
    sclera: ellipsePath(cx, eyeY, rx, openRy, cutY),
    smile: null,
    smileWidth: 0,
  };
};
