import type {
  ButtonHTMLAttributes,
  CSSProperties,
  HTMLAttributes,
  MouseEventHandler,
  ReactNode,
  Ref,
} from 'react';

import type { IconProps } from '@/Icon';

export type AlertType = 'success' | 'info' | 'warning' | 'error' | 'secondary';
export type AlertVariant =
  | 'soft'
  | 'outlined'
  | 'plain'
  /** @deprecated Use `soft` instead. */
  | 'filled'
  /** @deprecated Use `plain` instead. */
  | 'borderless';
export type AlertRef = HTMLDivElement;

export interface AlertCloseConfig extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'onClick' | 'type'
> {
  /** Called after the alert has been removed from the document. */
  afterClose?: () => void;
  /** Custom close affordance. */
  closeIcon?: ReactNode;
  /** Called when the close affordance is activated. */
  onClose?: MouseEventHandler<HTMLButtonElement>;
}

export interface AlertClassNames {
  action?: string;
  /** @deprecated Use `root` instead. */
  alert?: string;
  close?: string;
  container?: string;
  content?: string;
  description?: string;
  extra?: string;
  extraContent?: string;
  extraHeader?: string;
  extraIndicator?: string;
  icon?: string;
  root?: string;
  /** Alias for `content`, matching the former antd semantic part. */
  section?: string;
  title?: string;
}

export interface AlertStyles {
  action?: CSSProperties;
  /** @deprecated Use `root` instead. */
  alert?: CSSProperties;
  close?: CSSProperties;
  container?: CSSProperties;
  content?: CSSProperties;
  description?: CSSProperties;
  extra?: CSSProperties;
  extraContent?: CSSProperties;
  extraHeader?: CSSProperties;
  extraIndicator?: CSSProperties;
  icon?: CSSProperties;
  root?: CSSProperties;
  /** Alias for `content`, matching the former antd semantic part. */
  section?: CSSProperties;
  title?: CSSProperties;
}

interface AlertOwnProps {
  /** Optional action rendered after the message content. */
  action?: ReactNode;
  /** @deprecated Use `closable.afterClose` instead. */
  afterClose?: () => void;
  /** Removes the side border and radius for full-width notices. */
  banner?: boolean;
  classNames?: AlertClassNames;
  /** Whether the alert can be dismissed. */
  closable?: AlertCloseConfig | boolean;
  /** @deprecated Use `closable.closeIcon` instead. */
  closeIcon?: ReactNode;
  /** @deprecated Use `closable.closeIcon` instead. */
  closeText?: ReactNode;
  /** Whether the title adopts the semantic color. Neutral text is used by default. */
  colorfulText?: boolean;
  /** Supporting detail displayed beneath the title. */
  description?: ReactNode;
  /** Optional expandable or isolated detail content. */
  extra?: ReactNode;
  /** Whether expandable detail content starts open. */
  extraDefaultExpand?: boolean;
  /** Renders detail content as an independent sibling instead of a disclosure. */
  extraIsolate?: boolean;
  /** Enables backdrop blur for translucent host surfaces. */
  glass?: boolean;
  /** Custom semantic icon. */
  icon?: IconProps['icon'];
  /** Props forwarded to the Icon component. */
  iconProps?: Omit<IconProps, 'icon'>;
  /** @deprecated Use `title` instead. */
  message?: ReactNode;
  /** @deprecated Use `closable.onClose` instead. */
  onClose?: MouseEventHandler<HTMLButtonElement>;
  ref?: Ref<AlertRef>;
  /** Alias for `className`, retained for migration compatibility. */
  rootClassName?: string;
  /** Whether the semantic icon is rendered. */
  showIcon?: boolean;
  styles?: AlertStyles;
  text?: {
    detail?: string;
  };
  /** Primary message content. */
  title?: ReactNode;
  /** Semantic tone. */
  type?: AlertType;
  /** Surface treatment. `filled` and `borderless` remain as migration aliases. */
  variant?: AlertVariant;
}

type NativeAlertProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  keyof AlertOwnProps | 'children' | 'title'
>;

export type AlertProps = AlertOwnProps & NativeAlertProps;
