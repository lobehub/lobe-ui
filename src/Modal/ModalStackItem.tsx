'use client';

import { memo, useCallback, useMemo } from 'react';

import { useEventCallback } from '@/hooks/useEventCallback';

import Modal from './Modal';
import { ModalProvider } from './ModalProvider';
import type { ImperativeModalProps } from './type';

export type ModalStackItemProps = {
  id: string;
  onClose: (id: string) => void;
  onDestroy: (id: string) => void;
  onUpdate: (id: string, nextProps: Partial<ImperativeModalProps>) => void;
  props: ImperativeModalProps;
};

const noop = () => {};
export const ModalStackItem = memo(
  ({ id, props, onClose, onUpdate, onDestroy }: ModalStackItemProps) => {
    const { afterClose, afterOpenChange, children, onCancel, open, ...rest } = props;
    const stableAfterClose = useEventCallback(afterClose ?? noop);
    const stableAfterOpenChange = useEventCallback(afterOpenChange ?? noop);
    const stableOnCancel = useEventCallback(onCancel ?? noop);
    const close = useEventCallback(() => onClose(id));
    const setCanDismissByClickOutside = useEventCallback((value: boolean) =>
      onUpdate(id, { maskClosable: value }),
    );
    const stableContextValue = useMemo(
      () => ({ close, setCanDismissByClickOutside }),
      [close, setCanDismissByClickOutside],
    );

    return (
      <Modal
        {...rest}
        afterClose={useCallback(() => {
          stableAfterClose?.();
          onDestroy(id);
        }, [stableAfterClose, onDestroy, id])}
        afterOpenChange={useCallback(
          (nextOpen: boolean) => {
            stableAfterOpenChange?.(nextOpen);
            if (!nextOpen) onDestroy(id);
          },
          [stableAfterOpenChange, onDestroy, id],
        )}
        onCancel={useCallback(
          (event: React.MouseEvent<HTMLButtonElement>) => {
            stableOnCancel?.(event);
            close();
          },
          [stableOnCancel, close],
        )}
        open={open ?? true}
      >
        <ModalProvider value={stableContextValue}>{children}</ModalProvider>
      </Modal>
    );
  },
);

ModalStackItem.displayName = 'ModalStackItem';
