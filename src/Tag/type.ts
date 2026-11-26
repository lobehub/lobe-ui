import type { ComponentProps, CSSProperties, MouseEvent, ReactNode, Ref } from 'react';

export type TagShape = 'normal' | 'round';

export type TagSize = 'small' | 'middle' | 'large';

/**
 * `a2ui`: the A2UI playground badge / tag list look, a soft tinted chip (pill with
 * `shape="round"`). Its `color` maps to a tone: `success` / `green` positive, `error` / `red`
 * negative, `warning` / `gold` / `orange` warning, `info` / `processing` / `blue` info,
 * `purple` / `discovery` accent, anything else neutral; a hex colour tints with that colour.
 */
export type TagVariant = 'filled' | 'outlined' | 'borderless' | 'solid' | 'a2ui';

export interface TagClassNames {
  closeIcon?: string;
  root?: string;
}

export interface TagStyles {
  closeIcon?: CSSProperties;
  root?: CSSProperties;
}

export interface TagProps extends Omit<ComponentProps<'span'>, 'color'> {
  classNames?: TagClassNames;
  closable?: boolean;
  closeIcon?: ReactNode;
  color?: string;
  icon?: ReactNode;
  onClose?: (e: MouseEvent<HTMLSpanElement>) => void;
  ref?: Ref<HTMLSpanElement>;
  shape?: TagShape;
  size?: TagSize;
  styles?: TagStyles;
  variant?: TagVariant;
}
