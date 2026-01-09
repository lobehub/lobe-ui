'use client';

import { memo } from 'react';

import Modal from './Modal';
import { ModalProvider } from './ModalProvider';
import type { ContextBridgeComponent, ImperativeModalProps, ModalContextValue } from './type';

export type ModalStackItemProps = {
  bridge?: ContextBridgeComponent;
  id: string;
  onClose: (id: string) => void;
  onDestroy: (id: string) => void;
  onUpdate: (id: string, nextProps: Partial<ImperativeModalProps>) => void;
  props: ImperativeModalProps;
};

export const ModalStackItem = memo(
  ({ bridge: Bridge, id, props, onClose, onUpdate, onDestroy }: ModalStackItemProps) => {
    const { afterClose, afterOpenChange, children, onCancel, open, ...rest } = props;
    const close = () => onClose(id);
    const setCanDismissByClickOutside = (value: boolean) => {
      onUpdate(id, { maskClosable: value });
    };
    const contextValue: ModalContextValue = { close, setCanDismissByClickOutside };

    const content = <ModalProvider value={contextValue}>{children}</ModalProvider>;
    const wrappedContent = Bridge ? <Bridge>{content}</Bridge> : content;

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
        {wrappedContent}
      </Modal>
    );
  },
);

ModalStackItem.displayName = 'ModalStackItem';
