import type { ModalProps as AntModalProps } from 'antd';

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
