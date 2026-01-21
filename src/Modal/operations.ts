import { getModalStack, getRawDestroyTimers, notify, setModalStack } from './store';
import type { ImperativeModalProps } from './type';

export const updateModal = (id: string, nextProps: Partial<ImperativeModalProps>) => {
  const modalStack = getModalStack();
  let changed = false;
  const nextStack = modalStack.map((item) => {
    if (item.id !== id) return item;
    if (item.kind !== 'modal') return item;
    changed = true;
    return {
      ...item,
      props: { ...item.props, ...nextProps },
    };
  });

  if (changed) {
    setModalStack(nextStack);
    notify();
  }
};

export const updateRawProps = (id: string, nextProps: Record<string, unknown>) => {
  const modalStack = getModalStack();
  let changed = false;
  const nextStack = modalStack.map((item) => {
    if (item.id !== id) return item;
    if (item.kind !== 'raw') return item;
    changed = true;
    return {
      ...item,
      props: { ...item.props, ...nextProps },
    };
  });

  if (changed) {
    setModalStack(nextStack);
    notify();
  }
};

export const setRawOpen = (id: string, open: boolean) => {
  const modalStack = getModalStack();
  let changed = false;
  const nextStack = modalStack.map((item) => {
    if (item.id !== id) return item;
    if (item.kind !== 'raw') return item;
    if (item.open === open) return item;
    changed = true;
    return { ...item, open };
  });

  if (open) {
    const rawDestroyTimers = getRawDestroyTimers();
    const timer = rawDestroyTimers.get(id);
    if (timer) {
      clearTimeout(timer);
      rawDestroyTimers.delete(id);
    }
  }

  if (changed) {
    setModalStack(nextStack);
    notify();
  }
};

export const destroyModal = (id: string) => {
  const rawDestroyTimers = getRawDestroyTimers();
  const timer = rawDestroyTimers.get(id);
  if (timer) {
    clearTimeout(timer);
    rawDestroyTimers.delete(id);
  }
  const modalStack = getModalStack();
  const nextStack = modalStack.filter((item) => item.id !== id);
  if (nextStack.length === modalStack.length) return;
  setModalStack(nextStack);
  notify();
};
export const closeModal = (id: string) => {
  const modalStack = getModalStack();
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
  const rawDestroyTimers = getRawDestroyTimers();
  const existing = rawDestroyTimers.get(id);
  if (existing) clearTimeout(existing);
  const timer = window.setTimeout(() => {
    rawDestroyTimers.delete(id);
    destroyModal(id);
  }, delay);
  rawDestroyTimers.set(id, timer);
};
