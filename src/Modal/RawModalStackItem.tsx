'use client';

import type { ComponentType } from 'react';
import { memo, useEffectEvent, useMemo } from 'react';

import { ModalProvider } from './ModalProvider';
import type { ContextBridgeComponent, ModalContextValue, RawModalOptions } from './type';

export type RawModalStackItemProps = {
  bridge?: ContextBridgeComponent;
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
    bridge: Bridge,
    component: Component,
    id,
    onClose,
    onUpdate,
    open,
    options,
    props,
  }: RawModalStackItemProps) => {
    const close = useEffectEvent(() => onClose(id));
    const setCanDismissByClickOutside = useEffectEvent((value: boolean) => {
      onUpdate(id, { maskClosable: value });
    });
    const contextValue: ModalContextValue = useMemo(() => {
      return { close, setCanDismissByClickOutside };
    }, [close, setCanDismissByClickOutside]);
    const openKey = options?.openKey ?? 'open';
    const onCloseKey = options?.onCloseKey ?? 'onClose';
    const injectedProps = {
      ...props,
      [onCloseKey]: close,
      [openKey]: open,
    };

    const content = (
      <ModalProvider value={contextValue}>
        <Component {...injectedProps} />
      </ModalProvider>
    );

    return Bridge ? <Bridge>{content}</Bridge> : content;
  },
);

RawModalStackItem.displayName = 'RawModalStackItem';
