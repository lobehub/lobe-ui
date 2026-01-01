'use client';

import type { ReactNode } from 'react';
import { memo, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';

import { useIsClient } from '@/hooks/useIsClient';

import { ModalStackItem } from './ModalStackItem';
import { RawModalStackItem } from './RawModalStackItem';
import type {
  ImperativeModalProps,
  ModalInstance,
  RawModalComponent,
  RawModalComponentProps,
  RawModalInstance,
  RawModalKeyOptions,
  RawModalOptions,
} from './type';

type ModalStackItemBase = {
  id: string;
};

type ModalStackItemModal = ModalStackItemBase & {
  kind: 'modal';
  props: ImperativeModalProps;
};

type ModalStackItemRaw = ModalStackItemBase & {
  component: RawModalComponent;
  kind: 'raw';
  open: boolean;
  options?: RawModalOptions<PropertyKey, PropertyKey>;
  props: Record<string, unknown>;
};

type TModalStackItem = ModalStackItemModal | ModalStackItemRaw;

type ModalStackProps = {
  stack: TModalStackItem[];
};

export type ModalHostProps = {
  root?: HTMLElement | ShadowRoot | null;
};

const MODAL_PORTAL_ATTR = 'data-lobe-ui-modal-portal';

// Reuse one portal container per root (document.body by default).
const containerMap = new WeakMap<object, HTMLElement>();

let modalStack: TModalStackItem[] = [];
let modalSeed = 0;
const listeners = new Set<() => void>();
const rawDestroyTimers = new Map<string, number>();

const notify = () => {
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const EMPTY_STACK: TModalStackItem[] = [];
const getSnapshot = () => modalStack;
const getServerSnapshot = () => EMPTY_STACK;

const getOrCreateContainer = (root: HTMLElement | ShadowRoot): HTMLElement => {
  const cached = containerMap.get(root);
  if (cached && cached.isConnected) return cached;

  const el = document.createElement('div');
  el.setAttribute(MODAL_PORTAL_ATTR, 'true');
  root.append(el);
  containerMap.set(root, el);
  return el;
};

const resolveRoot = (root?: HTMLElement | ShadowRoot | null): HTMLElement | ShadowRoot | null => {
  if (root) return root;
  return document.body;
};

const ModalPortal = ({
  children,
  root,
}: {
  children: ReactNode;
  root?: HTMLElement | ShadowRoot | null;
}) => {
  const [container, setContainer] = useState<HTMLElement | null>(() => {
    const resolved = resolveRoot(root);
    if (!resolved) return null;
    return getOrCreateContainer(resolved);
  });

  if (!container) {
    setContainer(getOrCreateContainer(document.body));
  }

  if (!container) return null;
  return createPortal(children, container);
};

const updateModal = (id: string, nextProps: Partial<ImperativeModalProps>) => {
  let changed = false;
  modalStack = modalStack.map((item) => {
    if (item.id !== id) return item;
    if (item.kind !== 'modal') return item;
    changed = true;
    return {
      ...item,
      props: { ...item.props, ...nextProps },
    };
  });

  if (changed) notify();
};

const updateRawProps = (id: string, nextProps: Record<string, unknown>) => {
  let changed = false;
  modalStack = modalStack.map((item) => {
    if (item.id !== id) return item;
    if (item.kind !== 'raw') return item;
    changed = true;
    return {
      ...item,
      props: { ...item.props, ...nextProps },
    };
  });

  if (changed) notify();
};

const setRawOpen = (id: string, open: boolean) => {
  let changed = false;
  modalStack = modalStack.map((item) => {
    if (item.id !== id) return item;
    if (item.kind !== 'raw') return item;
    if (item.open === open) return item;
    changed = true;
    return { ...item, open };
  });

  if (open) {
    const timer = rawDestroyTimers.get(id);
    if (timer) {
      clearTimeout(timer);
      rawDestroyTimers.delete(id);
    }
  }

  if (changed) notify();
};

const closeModal = (id: string) => {
  const target = modalStack.find((item) => item.id === id);
  if (!target) return;

  if (target.kind === 'modal') {
    updateModal(id, { open: false });
    return;
  }

  setRawOpen(id, false);

  const shouldDestroy = target.options?.destroyOnClose ?? true;
  if (!shouldDestroy) return;

  const delay = target.options?.destroyDelay ?? 200;
  const existing = rawDestroyTimers.get(id);
  if (existing) clearTimeout(existing);
  const timer = window.setTimeout(() => {
    rawDestroyTimers.delete(id);
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    destroyModal(id);
  }, delay);
  rawDestroyTimers.set(id, timer);
};

const destroyModal = (id: string) => {
  const timer = rawDestroyTimers.get(id);
  if (timer) {
    clearTimeout(timer);
    rawDestroyTimers.delete(id);
  }
  const nextStack = modalStack.filter((item) => item.id !== id);
  if (nextStack.length === modalStack.length) return;
  modalStack = nextStack;
  notify();
};

const ModalStack = memo(({ stack }: ModalStackProps) => {
  const isClient = useIsClient();
  if (!isClient) return null;
  return stack.map((item) => {
    if (item.kind === 'modal') {
      return (
        <ModalStackItem
          id={item.id}
          key={item.id}
          onClose={closeModal}
          onDestroy={destroyModal}
          onUpdate={updateModal}
          props={item.props}
        />
      );
    }

    return (
      <RawModalStackItem
        component={item.component}
        id={item.id}
        key={item.id}
        onClose={closeModal}
        onUpdate={updateRawProps}
        open={item.open}
        options={item.options}
        props={item.props}
      />
    );
  });
});

ModalStack.displayName = 'ModalStack';

export const ModalHost = ({ root }: ModalHostProps) => {
  const stack = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isClient = useIsClient();
  if (!isClient) return null;
  if (stack.length === 0) return null;

  return (
    <ModalPortal root={root}>
      <ModalStack stack={stack} />
    </ModalPortal>
  );
};

export const createModal = (props: ImperativeModalProps): ModalInstance => {
  const id = `modal-${Date.now()}-${modalSeed++}`;
  modalStack = [
    ...modalStack,
    { id, kind: 'modal', props: { ...props, open: props.open ?? true } },
  ];
  notify();

  return {
    close: () => closeModal(id),
    destroy: () => destroyModal(id),
    setCanDismissByClickOutside: (value) => updateModal(id, { maskClosable: value }),
    update: (nextProps) => updateModal(id, nextProps),
  };
};

export function createRawModal<P extends RawModalComponentProps>(
  component: RawModalComponent<P>,
  props: Omit<P, 'open' | 'onClose'>,
  options?: RawModalOptions,
): RawModalInstance<P>;
// eslint-disable-next-line no-redeclare
export function createRawModal<P, OpenKey extends keyof P, CloseKey extends keyof P>(
  component: RawModalComponent<P>,
  props: Omit<P, OpenKey | CloseKey>,
  options: RawModalKeyOptions<OpenKey, CloseKey>,
): RawModalInstance<P, OpenKey, CloseKey>;
// eslint-disable-next-line no-redeclare
export function createRawModal<P, OpenKey extends keyof P, CloseKey extends keyof P>(
  component: RawModalComponent<P>,
  props: Omit<P, OpenKey | CloseKey>,
  options?: RawModalOptions<OpenKey, CloseKey>,
): RawModalInstance<P, OpenKey, CloseKey> {
  const id = `modal-${Date.now()}-${modalSeed++}`;
  modalStack = [
    ...modalStack,
    {
      component,
      id,
      kind: 'raw',
      open: true,
      options,
      props: props as Record<string, unknown>,
    },
  ];
  notify();

  return {
    close: () => closeModal(id),
    destroy: () => destroyModal(id),
    setCanDismissByClickOutside: (value) => updateRawProps(id, { maskClosable: value }),
    update: (nextProps) => updateRawProps(id, nextProps as Record<string, unknown>),
  };
}
