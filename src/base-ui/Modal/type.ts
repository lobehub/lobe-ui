import type { CSSProperties, MouseEvent, ReactNode } from 'react';

import type { ButtonProps as BaseButtonProps } from '../Button';

export interface BaseModalProps {
  children?: ReactNode;
  className?: string;
  classNames?: {
    backdrop?: string;
    close?: string;
    content?: string;
    footer?: string;
    header?: string;
    popup?: string;
    title?: string;
  };
  maskClosable?: boolean;
  onOpenChange?: (open: boolean) => void;
  onOpenChangeComplete?: (open: boolean) => void;
  open?: boolean;
  styles?: {
    backdrop?: CSSProperties;
    close?: CSSProperties;
    content?: CSSProperties;
    footer?: CSSProperties;
    header?: CSSProperties;
    popup?: CSSProperties;
    title?: CSSProperties;
  };
  title?: ReactNode;
  width?: number | string;
}

export interface ModalContextValue {
  close: () => void;
  setCanDismissByClickOutside: (value: boolean) => void;
}

export interface ModalInstance extends ModalContextValue {
  destroy: () => void;
  update: (nextProps: Partial<BaseModalProps>) => void;
}

export type ImperativeModalProps = BaseModalProps & {
  content?: ReactNode;
  footer?: ReactNode;
};

type ModalButtonProps = BaseButtonProps;

export interface ModalComponentProps {
  afterClose?: () => void;
  afterOpenChange?: (open: boolean) => void;
  allowFullscreen?: boolean;
  cancelButtonProps?: ModalButtonProps;
  cancelText?: ReactNode;
  centered?: boolean;
  children?: ReactNode;
  className?: string;
  classNames?: {
    body?: string;
    footer?: string;
    header?: string;
    mask?: string;
    title?: string;
    wrapper?: string;
  };
  closable?: boolean;
  closeIcon?: ReactNode;
  confirmLoading?: boolean;
  destroyOnHidden?: boolean;
  draggable?: boolean;
  footer?:
    | ReactNode
    | false
    | null
    | ((originNode: ReactNode, extra: { CancelBtn: React.FC; OkBtn: React.FC }) => ReactNode);
  getContainer?: HTMLElement | false | null;
  height?: number | string;
  keyboard?: boolean;
  loading?: boolean;
  mask?: boolean;
  maskClosable?: boolean;
  okButtonProps?: ModalButtonProps;
  okText?: ReactNode;
  onCancel?: (e: MouseEvent<HTMLButtonElement>) => void;
  onOk?: (e: MouseEvent<HTMLButtonElement>) => void;
  open?: boolean;
  style?: CSSProperties;
  styles?: {
    body?: CSSProperties;
    footer?: CSSProperties;
    header?: CSSProperties;
    mask?: CSSProperties;
    title?: CSSProperties;
    wrapper?: CSSProperties;
  };
  title?: ReactNode | false;
  width?: number | string;
  zIndex?: number;
}

export interface ModalConfirmConfig {
  cancelText?: ReactNode;
  content?: ReactNode;
  okButtonProps?: ModalButtonProps;
  okText?: ReactNode;
  onCancel?: () => void;
  onOk?: (() => void) | (() => Promise<void>);
  title?: ReactNode;
}
