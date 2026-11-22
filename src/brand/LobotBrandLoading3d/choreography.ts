/**
 * The loader's loop as pure functions of time, so a frame can be drawn (and tested) for any
 * moment. One loop is a crouch, a jump with a full turn of the head, a landing that squashes
 * and rebounds into a smile, and then the head rolling once around to look about.
 *
 * Everything is in the 100 × 100 canvas of `AgentAvatar`, whose `lobot` shape and implied
 * volume draw the body.
 */
import type { AvatarLook } from '@/AgentAvatar/look';

/** Seconds of one loop. */
export const LOOP_SECONDS = 3.2;

const TAU = Math.PI * 2;

const CROUCH_END = 0.28;
const AIR_SECONDS = 0.8;
const AIR_END = CROUCH_END + AIR_SECONDS;
const SPIN_START = 0.2;
const SPIN_SECONDS = 0.96;
const LAND_SECONDS = 0.42;
const ROLL_START = 1.5;
const ROLL_SECONDS = LOOP_SECONDS - ROLL_START;

/** Height of the jump, canvas units. */
const JUMP_HEIGHT = 10;
/** How far the head turns and tips while it rolls around, radians. */
const ROLL_YAW = 0.5;
const ROLL_PITCH = 0.24;

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const smooth = (value: number) => {
  const x = clamp(value);
  return x * x * (3 - 2 * x);
};
const easeInOut = (value: number) => {
  const x = clamp(value);
  return x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2;
};
const loopTime = (time: number) => ((time % LOOP_SECONDS) + LOOP_SECONDS) % LOOP_SECONDS;

/** Share of the turn completed, 0..1. */
const spin = (u: number) => easeInOut((u - SPIN_START) / SPIN_SECONDS);

/** Height above the ground, 0..1, while airborne. */
const air = (u: number) => {
  const p = clamp((u - CROUCH_END) / AIR_SECONDS);
  return 4 * p * (1 - p);
};

/** Vertical stretch of the body about its base; below 1 is a squash. */
const stretch = (u: number) => {
  const p = (u - CROUCH_END) / AIR_SECONDS;
  const crouch = u < CROUCH_END ? smooth(u / CROUCH_END) : 1 - smooth(p / 0.16);
  const landed = (u - AIR_END) / LAND_SECONDS;
  const landing =
    landed > 0 && landed < 1
      ? Math.exp(-5 * landed) * Math.cos(3 * Math.PI * landed) * smooth(landed / 0.1)
      : 0;
  return 1 - 0.13 * crouch + 0.07 * Math.sin(Math.PI * clamp(p)) - 0.14 * landing;
};

/** The head rolling around: its angle and how far it has leaned out, 0..1. */
const roll = (u: number) => {
  const w = clamp((u - ROLL_START) / ROLL_SECONDS);
  return { angle: TAU * w, lean: smooth(w / 0.22) * smooth((1 - w) / 0.22) };
};

/** The body pose and eyes at `time` seconds. */
export const loadingLook = (time: number): AvatarLook => {
  const u = loopTime(time);
  const sy = stretch(u);
  const turn = spin(u);
  const { angle, lean } = roll(u);
  const crouch = u < CROUCH_END ? smooth(u / CROUCH_END) : 0;
  const flying = air(u);
  // A contented squint from the landing until the head starts to roll.
  const smile = smooth((u - AIR_END - 0.03) / 0.1) * (1 - smooth((u - ROLL_START - 0.06) / 0.12));

  return {
    arc: smile,
    gazeMix: 1,
    gazeX: 0.85 * lean * Math.sin(angle),
    gazeY: -0.65 * crouch - 0.4 * flying - 0.7 * lean * Math.cos(angle),
    lift: -JUMP_HEIGHT * flying,
    pitch: -0.1 * crouch + ROLL_PITCH * lean * Math.cos(angle),
    roll: 3.5 * lean * Math.sin(angle),
    shift: 0,
    slit: 0,
    squintL: 0,
    squintR: 0,
    sx: 1 - 0.6 * (sy - 1),
    sy,
    wide: 0.45 * flying,
    yaw: (turn < 1 ? TAU * turn : 0) + ROLL_YAW * lean * Math.sin(angle),
  };
};

export interface LoadingBubble {
  r: number;
  x: number;
  y: number;
}

/**
 * The orbit of the two bubbles: the logo's own bubbles are the ends of its long axis, the small
 * one on the left and the large one on the right. A bubble rises over the head from the left,
 * grows on the way, and returns behind the body.
 */
const ORBIT = {
  /** Half of the long and short axis. */
  a: 23.28,
  b: 9.2,
  /** Tilt of the long axis: its right end sits higher. */
  cos: Math.cos((-10.572 * Math.PI) / 180),
  sin: Math.sin((-10.572 * Math.PI) / 180),
  x: 50.23,
  y: 18.01,
};
const BUBBLE_SMALL = 3.32;
const BUBBLE_LARGE = 5.74;
/** Turns of the orbit per loop, on top of the one the head's turn drags along. */
const ORBIT_TURNS = 2;
/** The dragged turn is spread over this window, so the bubbles speed up without blurring. */
const DRAG_START = 0.1;
const DRAG_SECONDS = 1.6;
/** The bubbles trail the head by this long, so they read as loose rather than attached. */
const FOLLOW_LAG = 0.07;
/** The body squashes about this height, and the head top the bubbles ride on is near 16. */
const BASE_Y = 90;

/** The two bubbles at `time` seconds. They are drawn behind the body. */
export const loadingBubbles = (time: number): [LoadingBubble, LoadingBubble] => {
  const u = loopTime(time);
  const lagged = loopTime(time - FOLLOW_LAG);
  const phase = TAU * ((ORBIT_TURNS * u) / LOOP_SECONDS + smooth((u - DRAG_START) / DRAG_SECONDS));
  // Flung outward while the head turns in the air.
  const reach = 1 + 0.2 * air(u);
  const top = -JUMP_HEIGHT * air(lagged) + (BASE_Y - ORBIT.y) * (1 - stretch(lagged));

  const bubble = (theta: number): LoadingBubble => {
    const along = -ORBIT.a * reach * Math.cos(theta);
    const across = -ORBIT.b * reach * Math.sin(theta);
    return {
      r: BUBBLE_SMALL + ((BUBBLE_LARGE - BUBBLE_SMALL) * (1 - Math.cos(theta))) / 2,
      x: ORBIT.x + along * ORBIT.cos - across * ORBIT.sin,
      y: ORBIT.y + top + along * ORBIT.sin + across * ORBIT.cos,
    };
  };

  return [bubble(phase), bubble(phase + Math.PI)];
};
