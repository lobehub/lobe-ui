import type { CSSProperties, Ref, SVGProps } from 'react';

/** Silhouettes. Every shape shares the same flat body + big-eyes construction. */
export type AgentAvatarShape =
  | 'face'
  | 'bowl'
  | 'cloud'
  | 'tile'
  | 'hex'
  | 'shield'
  | 'pudding'
  | 'cookie'
  | 'star'
  | 'capsule'
  | 'ghost'
  | 'cat';

/** Body colors, resolved from the theme color scales so they adapt to dark mode. */
export type AgentAvatarColor =
  'purple' | 'orange' | 'geekblue' | 'volcano' | 'magenta' | 'ink' | 'gray';

/**
 * Activity state, expressed through the eyes and motion only:
 * - `idle`: wandering gaze and blinks
 * - `working`: looking down, scanning
 * - `waiting`: looking at you, slight sway
 * - `blocked`: wide eyes, small pupils and an error badge
 * - `thinking`: looking up with rising thought bubbles
 * - `done`: closed smiling eyes and a small hop
 */
export type AgentAvatarState = 'idle' | 'working' | 'waiting' | 'blocked' | 'thinking' | 'done';

export interface AgentAvatarClassNames {
  /** The `blocked` error badge. */
  badge?: string;
  /** The silhouette path. */
  body?: string;
  /** The eyes group (eye whites and pupils, or the closed eyes of `done`). */
  eyes?: string;
  root?: string;
  /** The `thinking` thought bubbles. */
  thought?: string;
}

export interface AgentAvatarStyles {
  badge?: CSSProperties;
  body?: CSSProperties;
  eyes?: CSSProperties;
  root?: CSSProperties;
  thought?: CSSProperties;
}

export interface AgentAvatarProps extends Omit<
  SVGProps<SVGSVGElement>,
  'children' | 'color' | 'name' | 'ref' | 'shape'
> {
  /**
   * Play the state animation. Motion is always dropped under `prefers-reduced-motion: reduce`,
   * which falls back to the still pose of the state.
   * @default false
   */
  animated?: boolean;
  /** Class names of the semantic parts. */
  classNames?: AgentAvatarClassNames;
  /**
   * Body color. A palette key resolves to a theme color that adapts to dark mode; any other
   * string is used as a CSS color as is. Derived from the seed when omitted.
   */
  color?: AgentAvatarColor | (string & {});
  /**
   * Accessible name (`aria-label`); also the seed when `seed` is omitted. Without a name or
   * `aria-label` the avatar is decorative and hidden from assistive technology.
   */
  name?: string;
  ref?: Ref<SVGSVGElement>;
  /**
   * Stable key the shape and color are derived from: the same seed always gives the same
   * avatar. Falls back to `name`.
   */
  seed?: string;
  /** Silhouette. Derived from the seed when omitted. */
  shape?: AgentAvatarShape;
  /**
   * Width and height in pixels. At 24px and below the pupils shrink a bit so the eye whites
   * stay visible.
   * @default 40
   */
  size?: number;
  /**
   * Activity state.
   * @default 'idle'
   */
  state?: AgentAvatarState;
  /** Inline styles of the semantic parts. */
  styles?: AgentAvatarStyles;
}
