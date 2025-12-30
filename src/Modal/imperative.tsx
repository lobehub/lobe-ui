'use client';

import type { ReactNode } from 'react';
import { memo, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';

import { useIsClient } from '@/hooks/useIsClient';

import { ModalStackItem } from './ModalStackItem';
import type { ImperativeModalProps, ModalInstance } from './type';

type TModalStackItem = {
  id: string;
  props: ImperativeModalProps;
};

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

const notify = () => {
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSnapshot = () => modalStack;
const getServerSnapshot = () => [];

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
    changed = true;
    return {
      ...item,
      props: { ...item.props, ...nextProps },
    };
  });

  if (changed) notify();
};

const closeModal = (id: string) => {
  updateModal(id, { open: false });
};

const destroyModal = (id: string) => {
  const nextStack = modalStack.filter((item) => item.id !== id);
  if (nextStack.length === modalStack.length) return;
  modalStack = nextStack;
  notify();
};

const ModalStack = memo(({ stack }: ModalStackProps) => {
  const isClient = useIsClient();
  if (!isClient) return null;
  return stack.map(({ id, props }) => (
    <ModalStackItem
      id={id}
      key={id}
      onClose={closeModal}
      onDestroy={destroyModal}
      onUpdate={updateModal}
      props={props}
    />
  ));
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
  modalStack = [...modalStack, { id, props: { ...props, open: props.open ?? true } }];
  notify();

  return {
    close: () => closeModal(id),
    destroy: () => destroyModal(id),
    setCanDismissByClickOutside: (value) => updateModal(id, { maskClosable: value }),
    update: (nextProps) => updateModal(id, nextProps),
  };
};
