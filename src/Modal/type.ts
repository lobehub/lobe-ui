import type { ModalProps as AntModalProps } from 'antd';

export type ModalProps = Omit<AntModalProps, 'okType' | 'wrapClassName'> & {
  allowFullscreen?: boolean;
  enableResponsive?: boolean;
  paddings?: {
    desktop?: number;
    mobile?: number;
  };
};
