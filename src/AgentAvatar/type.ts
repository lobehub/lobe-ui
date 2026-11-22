import type { CSSProperties, HTMLAttributes, ReactNode, Ref, SVGProps } from 'react';

/** Silhouettes. Every shape shares the same soft volume and the big Lobot logo eyes. */
export type AgentAvatarShape =
  | 'lobot'
  | 'face'
  | 'cloud'
  | 'ghost'
  | 'cat'
  | 'bear'
  | 'bunny'
  | 'frog'
  | 'robot'
  | 'star'
  | 'cookie'
  | 'pudding'
  | 'bowl'
  | 'mug'
  | 'sprout'
  | 'bulb'
  | 'chat'
  | 'book'
  | 'magnifier'
  | 'rocket'
  | 'shield'
  | 'tile'
  | 'hex'
  | 'capsule';

/** Body colors, resolved from the theme color scales so they adapt to dark mode. */
export type AgentAvatarColor =
  | 'red'
  | 'volcano'
  | 'orange'
  | 'green'
  | 'cyan'
  | 'geekblue'
  | 'purple'
  | 'magenta'
  | 'gray'
  | 'ink';

/**
 * Activity state, shown on the avatar itself and always inside its box:
 * - `idle`: looks around and blinks
 * - `working`: eyes scan across the work with a quick bob
 * - `waiting`: heavy lids and a slight lean
 * - `blocked`: wide eyes, small pupils, a short shake and an error badge
 * - `thinking`: looks up and away with small thought bubbles
 * - `done`: closed smiling eyes and two small hops
 */
export type AgentAvatarState = 'idle' | 'working' | 'waiting' | 'blocked' | 'thinking' | 'done';

export interface AgentAvatarClassNames {
  /** The `blocked` error badge. */
  badge?: string;
  /** The body group (the cross-sections of the silhouette). */
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
   * Turn the eyes and body toward the pointer. Only applies while the avatar is `animated`.
   * @default false
   */
  followPointer?: boolean;
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
   * Width and height in pixels.
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
  /**
   * Lean the body a few degrees (-3° to 3°), derived from the seed like the shape and color, so a
   * group of avatars feels less rigid. The badge and thought bubbles stay upright.
   * @default true
   */
  tilt?: boolean;
}

/** A choice made in `AgentAvatarPicker`. */
export interface AgentAvatarValue {
  color: AgentAvatarColor;
  shape: AgentAvatarShape;
}

export interface AgentAvatarPickerTexts {
  /** Accessible name of the color group. */
  colors?: string;
  /** Accessible name of the shape group. */
  shapes?: string;
}

export interface AgentAvatarPickerProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'defaultValue' | 'onChange'
> {
  /** Initial choice when uncontrolled. */
  defaultValue?: Partial<AgentAvatarValue>;
  /** Called on every change of shape or color. */
  onChange?: (value: AgentAvatarValue) => void;
  /**
   * Show a live preview above the options.
   * @default true
   */
  preview?: boolean;
  ref?: Ref<HTMLDivElement>;
  /** Overrides of the built-in texts. */
  texts?: AgentAvatarPickerTexts;
  /** The current choice, for a controlled picker. */
  value?: AgentAvatarValue;
}

export interface CreateAgentAvatarTabOptions {
  /** Tab label. Defaults to a small Lobot with a tooltip. */
  label?: ReactNode;
  /**
   * Where the tab sits among the built-in tabs. `start` makes it the first tab and the one the
   * picker opens on.
   * @default 'start'
   */
  placement?: 'start' | 'end';
  /** Overrides of the picker texts, plus `tab` for the default tooltip. */
  texts?: AgentAvatarPickerTexts & { tab?: string };
  /**
   * Tab key.
   * @default 'agent-avatar'
   */
  value?: string;
}
