'use client';

import { memo } from 'react';

import Modal from './Modal';
import { ModalProvider } from './ModalProvider';
import type { ImperativeModalProps, ModalContextValue } from './type';

export type ModalStackItemProps = {
  id: string;
  onClose: (id: string) => void;
  onDestroy: (id: string) => void;
  onUpdate: (id: string, nextProps: Partial<ImperativeModalProps>) => void;
  props: ImperativeModalProps;
};

export const ModalStackItem = memo(
  ({ id, props, onClose, onUpdate, onDestroy }: ModalStackItemProps) => {
    const { afterClose, afterOpenChange, children, onCancel, open, ...rest } = props;
    const close = () => onClose(id);
    const setCanDismissByClickOutside = (value: boolean) => {
      onUpdate(id, { maskClosable: value });
    };
    const contextValue: ModalContextValue = { close, setCanDismissByClickOutside };

    return (
      <Modal
        {...rest}
        afterClose={() => {
          afterClose?.();
          onDestroy(id);
        }}
        afterOpenChange={(nextOpen) => {
          afterOpenChange?.(nextOpen);
          if (!nextOpen) onDestroy(id);
        }}
        onCancel={(event) => {
          onCancel?.(event as any);
          close();
        }}
        open={open ?? true}
      >
        <ModalProvider value={contextValue}>{children}</ModalProvider>
      </Modal>
    );
  },
);

ModalStackItem.displayName = 'ModalStackItem';
