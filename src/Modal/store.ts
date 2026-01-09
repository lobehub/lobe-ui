import type { TModalStackItem } from './stackTypes';

let modalStack: TModalStackItem[] = [];
let modalSeed = 0;
const listeners = new Set<() => void>();
const rawDestroyTimers = new Map<string, number>();

export const notify = () => {
  listeners.forEach((listener) => listener());
};

export const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const EMPTY_STACK: TModalStackItem[] = [];
export const getSnapshot = () => modalStack;
export const getServerSnapshot = () => EMPTY_STACK;

export const getModalStack = () => modalStack;
export const setModalStack = (stack: TModalStackItem[]) => {
  modalStack = stack;
};

export const getModalSeed = () => modalSeed;
export const incrementModalSeed = () => modalSeed++;

export const getRawDestroyTimers = () => rawDestroyTimers;
