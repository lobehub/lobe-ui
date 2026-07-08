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
