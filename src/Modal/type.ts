import type { ModalProps as AntModalProps } from 'antd';
import type { ComponentType } from 'react';

export type ModalProps = Omit<AntModalProps, 'okType' | 'wrapClassName'> & {
  allowFullscreen?: boolean;
  enableResponsive?: boolean;
  paddings?: {
    desktop?: number;
    mobile?: number;
  };
};

export type ModalContextValue = {
  close: () => void;
  setCanDismissByClickOutside: (value: boolean) => void;
};

export type ModalInstance = ModalContextValue & {
  destroy: () => void;
  update: (nextProps: Partial<ImperativeModalProps>) => void;
};

export type ImperativeModalProps = ModalProps;

export type RawModalComponentProps = {
  onClose: () => void;
  open: boolean;
};

export type RawModalComponent<P = any> = ComponentType<P>;

export type RawModalOptions<
  OpenKey extends PropertyKey = 'open',
  CloseKey extends PropertyKey = 'onClose',
> = {
  destroyDelay?: number;
  destroyOnClose?: boolean;
  onCloseKey?: CloseKey;
  openKey?: OpenKey;
};

export type RawModalKeyOptions<
  OpenKey extends PropertyKey = 'open',
  CloseKey extends PropertyKey = 'onClose',
> = RawModalOptions<OpenKey, CloseKey> & {
  onCloseKey: CloseKey;
  openKey: OpenKey;
};

export type RawModalInstance<
  P extends Record<string, unknown> = Record<string, unknown>,
  OpenKey extends PropertyKey = 'open',
  CloseKey extends PropertyKey = 'onClose',
> = ModalContextValue & {
  destroy: () => void;
  update: (
    nextProps: Partial<Omit<P, Extract<OpenKey, keyof P> | Extract<CloseKey, keyof P>>>,
  ) => void;
};
