'use client';

import { cx, useTheme } from 'antd-style';
import type { ReactNode } from 'react';
import { memo, useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';

import { useIsClient } from '@/hooks/useIsClient';
import { useAppElement } from '@/ThemeProvider';
import { registerDevSingleton } from '@/utils/devSingleton';
import { safeReadableColor } from '@/utils/safeReadableColor';

import {
  ModalBackdrop,
  ModalClose,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalPopup,
  ModalPortal,
  ModalRoot,
  ModalTitle,
} from './atoms';
import { ModalContext, useModalContext } from './context';
import { styles } from './style';
import type { ImperativeModalProps, ModalConfirmConfig, ModalInstance } from './type';
import { acquireModalZIndex } from './zIndexManager';

// --- Shared types ---

type ModalStackEntry = {
  id: string;
  props: ImperativeModalProps;
};

// --- Shared components (stack-independent) ---

const ModalPortalWrapper = ({
  children,
  root,
}: {
  children: ReactNode;
  root?: HTMLElement | ShadowRoot | null;
}) => {
  const appElement = useAppElement();
  const container = root ?? appElement ?? document.body;
  return createPortal(children, container);
};

const ConfirmBody = ({ config }: { config: ModalConfirmConfig }) => {
  const { close } = useModalContext();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);

  const { cancelText = 'Cancel', content, okButtonProps, okText = 'OK', onCancel, onOk } = config;

  const { danger, className: okUserCls, style: okUserStyle, ...restOkProps } = okButtonProps ?? {};
  const okBgColor = danger ? theme.colorError : theme.colorPrimary;
  const okTextColor = safeReadableColor(okBgColor);

  const handleCancel = useCallback(() => {
    close();
    onCancel?.();
  }, [close, onCancel]);

  const handleOk = useCallback(async () => {
    if (onOk) {
      try {
        const result = onOk();
        if (result && typeof (result as any).then === 'function') {
          setLoading(true);
          await result;
          setLoading(false);
        }
      } catch {
        setLoading(false);
        return;
      }
    }
    close();
  }, [close, onOk]);

  return (
    <>
      {content && <div style={{ padding: '16px 24px' }}>{content}</div>}
      <ModalFooter>
        <button
          className={cx(styles.buttonBase, styles.cancelButton)}
          type="button"
          onClick={handleCancel}
        >
          {cancelText}
        </button>
        <button
          {...restOkProps}
          disabled={loading}
          style={{ color: okTextColor, ...okUserStyle }}
          type="button"
          className={cx(
            styles.buttonBase,
            danger ? styles.dangerOkButton : styles.okButton,
            okUserCls,
          )}
          onClick={handleOk}
        >
          {loading && <span className={styles.loadingSpinner} />}
          {okText}
        </button>
      </ModalFooter>
    </>
  );
};
ConfirmBody.displayName = 'ConfirmBody';

// --- Factory ---

export interface ModalHostProps {
  root?: HTMLElement | ShadowRoot | null;
}

export interface ModalSystem {
  confirmModal: (config: ModalConfirmConfig) => { close: () => void; destroy: () => void };
  createModal: (props: ImperativeModalProps) => ModalInstance;
  ModalHost: React.FC<ModalHostProps>;
}

let systemSeed = 0;

export function createModalSystem(): ModalSystem {
  const systemId = systemSeed++;
  const singletonName = systemId === 0 ? 'BaseModalHost' : `BaseModalHost-${systemId}`;

  // --- Stack state (isolated per system) ---
  let modalStack: ModalStackEntry[] = [];
  let modalSeed = 0;
  const listeners = new Set<() => void>();

  const notify = () => listeners.forEach((l) => l());
  const subscribe = (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  };
  const EMPTY: ModalStackEntry[] = [];
  const getSnapshot = () => modalStack;
  const getServerSnapshot = () => EMPTY;

  // --- Stack operations ---

  const updateModal = (id: string, next: Partial<ImperativeModalProps>) => {
    let changed = false;
    modalStack = modalStack.map((item) => {
      if (item.id !== id) return item;
      changed = true;
      return { ...item, props: { ...item.props, ...next } };
    });
    if (changed) notify();
  };

  const closeModal = (id: string) => {
    updateModal(id, { open: false });
  };

  const destroyModal = (id: string) => {
    const next = modalStack.filter((item) => item.id !== id);
    if (next.length === modalStack.length) return;
    modalStack = next;
    notify();
  };

  // --- Stack Item (captures operations via closure) ---

  const StackItem = memo(({ entry }: { entry: ModalStackEntry }) => {
    const { id, props } = entry;
    const {
      children,
      classNames,
      content,
      footer,
      maskClosable,
      onOpenChange,
      onOpenChangeComplete,
      open,
      styles: semanticStyles,
      title,
      width,
    } = props;

    const isOpen = open ?? true;

    const zIndexRef = useRef<number | undefined>(undefined);
    const prevOpenRef = useRef(false);
    if (isOpen && !prevOpenRef.current) {
      zIndexRef.current = acquireModalZIndex();
    }
    prevOpenRef.current = isOpen;
    const zIndex = zIndexRef.current ?? 1000;

    const handleOpenChange = useCallback(
      (nextOpen: boolean, eventDetails?: { reason: string }) => {
        if (!nextOpen && maskClosable === false && eventDetails?.reason === 'outside-press') return;
        if (!nextOpen) closeModal(id);
        onOpenChange?.(nextOpen);
      },
      [id, maskClosable, onOpenChange],
    );

    const handleExitComplete = useCallback(() => {
      onOpenChangeComplete?.(false);
      destroyModal(id);
    }, [id, onOpenChangeComplete]);

    const close = useCallback(() => closeModal(id), [id]);
    const setCanDismissByClickOutside = useCallback(
      (value: boolean) => updateModal(id, { maskClosable: value }),
      [id],
    );

    const showTitle = title !== undefined && title !== false && title !== null;

    return (
      <ModalContext value={{ close, setCanDismissByClickOutside }}>
        <ModalRoot
          open={isOpen}
          onExitComplete={handleExitComplete}
          onOpenChange={handleOpenChange}
        >
          <ModalPortal>
            <ModalBackdrop
              className={classNames?.backdrop}
              style={{ zIndex, ...semanticStyles?.backdrop }}
            />
            <ModalPopup
              className={classNames?.popup}
              popupStyle={{ zIndex: zIndex + 1, ...semanticStyles?.popup }}
              width={width}
            >
              {showTitle && (
                <ModalHeader className={classNames?.header} style={semanticStyles?.header}>
                  <ModalTitle className={classNames?.title} style={semanticStyles?.title}>
                    {title}
                  </ModalTitle>
                  <ModalClose className={classNames?.close} style={semanticStyles?.close} />
                </ModalHeader>
              )}
              <ModalContent className={classNames?.content} style={semanticStyles?.content}>
                {content ?? children}
              </ModalContent>
              {footer}
            </ModalPopup>
          </ModalPortal>
        </ModalRoot>
      </ModalContext>
    );
  });
  StackItem.displayName = 'ModalStackItem';

  const StackRenderer = memo(({ stack }: { stack: ModalStackEntry[] }) => {
    const isClient = useIsClient();
    if (!isClient) return null;
    return stack.map((entry) => <StackItem entry={entry} key={entry.id} />);
  });
  StackRenderer.displayName = 'ModalStackRenderer';

  // --- ModalHost ---

  const Host = ({ root }: ModalHostProps) => {
    const stack = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    const isClient = useIsClient();

    useEffect(() => {
      if (!isClient) return;
      const scope = root ?? document.body;
      return registerDevSingleton(singletonName, scope);
    }, [isClient, root]);

    if (!isClient) return null;
    if (stack.length === 0) return null;

    return (
      <ModalPortalWrapper root={root}>
        <StackRenderer stack={stack} />
      </ModalPortalWrapper>
    );
  };

  // --- createModal ---

  const create = (props: ImperativeModalProps): ModalInstance => {
    const id = `base-modal-${Date.now()}-${modalSeed++}`;
    modalStack = [...modalStack, { id, props: { ...props, open: props.open ?? true } }];
    notify();

    return {
      close: () => closeModal(id),
      destroy: () => destroyModal(id),
      setCanDismissByClickOutside: (value) => updateModal(id, { maskClosable: value }),
      update: (nextProps) => updateModal(id, nextProps),
    };
  };

  // --- confirmModal ---

  const confirm = (config: ModalConfirmConfig) => {
    const instance = create({
      content: <ConfirmBody config={config} />,
      styles: { content: { padding: 0 } },
      title: config.title,
      width: 420,
    });

    return {
      close: instance.close,
      destroy: instance.destroy,
    };
  };

  return { ModalHost: Host, confirmModal: confirm, createModal: create };
}

// --- Default global instance (backward compatible) ---

const defaultSystem = createModalSystem();
export const ModalHost = defaultSystem.ModalHost;
export const createModal = defaultSystem.createModal;
export const confirmModal = defaultSystem.confirmModal;
