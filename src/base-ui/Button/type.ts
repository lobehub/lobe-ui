import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  CSSProperties,
  ReactNode,
  Ref,
} from 'react';

import type { IconProps } from '@/Icon';

export type ButtonType = 'default' | 'primary' | 'dashed' | 'fill' | 'link' | 'text';
export type ButtonShape = 'default' | 'circle' | 'round';
export type ButtonSize = 'small' | 'middle' | 'large';
export type ButtonIconPosition = 'start' | 'end';

interface BaseButtonOwnProps {
  block?: boolean;
  children?: ReactNode;
  classNames?: { icon?: string };
  danger?: boolean;
  disabled?: boolean;
  /**
   * Strips the fill and the border, leaving only the type's semantic color and a hover
   * wash. Unlike antd's `ghost`, this is not an on-dark-background variant. It is a no-op
   * on `text` and `link`, which already carry no surface.
   */
  ghost?: boolean;
  href?: string;
  htmlType?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
  icon?: IconProps['icon'] | ReactNode;
  iconPosition?: ButtonIconPosition;
  loading?: boolean;
  ref?: Ref<HTMLButtonElement | HTMLAnchorElement>;
  shape?: ButtonShape;
  size?: ButtonSize;
  styles?: { icon?: CSSProperties };
  target?: string;
  type?: ButtonType;
}

type NativeButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  keyof BaseButtonOwnProps | 'type'
>;

type NativeAnchorProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  keyof BaseButtonOwnProps | 'type'
>;

export type ButtonProps = BaseButtonOwnProps & NativeButtonProps & Partial<NativeAnchorProps>;
