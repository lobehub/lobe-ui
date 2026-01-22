'use client';

import type { ComponentType } from 'react';
import { memo, useMemo } from 'react';

import { useEventCallback } from '@/hooks/useEventCallback';

import { ModalProvider } from './ModalProvider';
import type { ModalContextValue, RawModalOptions } from './type';

export type RawModalStackItemProps = {
  component: ComponentType<any>;
  id: string;
  onClose: (id: string) => void;
  onUpdate: (id: string, nextProps: Record<string, unknown>) => void;
  open: boolean;
  options?: RawModalOptions<PropertyKey, PropertyKey>;
  props: Record<string, unknown>;
};

export const RawModalStackItem = memo(
  ({
    component: Component,
    id,
    onClose,
    onUpdate,
    open,
    options,
    props,
  }: RawModalStackItemProps) => {
    const stableOnClose = useEventCallback(onClose);
    const close = useEventCallback(() => stableOnClose(id));

    const setCanDismissByClickOutside = useEventCallback((value: boolean) => {
      onUpdate(id, { maskClosable: value });
    });
    const contextValue: ModalContextValue = useMemo(
      () => ({ close, setCanDismissByClickOutside }),
      [close, setCanDismissByClickOutside],
    );
    const openKey = options?.openKey ?? 'open';
    const onCloseKey = options?.onCloseKey ?? 'onClose';
    const injectedProps = {
      ...props,
      [onCloseKey]: close,
      [openKey]: open,
    };

    return (
      <ModalProvider value={contextValue}>
        <Component {...injectedProps} />
      </ModalProvider>
    );
  },
);

RawModalStackItem.displayName = 'RawModalStackItem';
