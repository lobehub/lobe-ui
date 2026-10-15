import type { ComponentProps, CSSProperties, MouseEvent, ReactNode, Ref } from 'react';

export type TagShape = 'normal' | 'round';

export type TagSize = 'small' | 'middle' | 'large';

export type TagVariant = 'filled' | 'outlined' | 'borderless' | 'solid';

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
