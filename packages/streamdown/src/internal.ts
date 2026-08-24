import { useRef } from 'react';

export const getNow = (): number => {
  return typeof performance === 'undefined' ? Date.now() : performance.now();
};

// Structural equality for prop/config-shaped values: primitives, plain
// records, and arrays. Functions and class instances are compared by
// reference (caller is expected to memoise callbacks via useCallback).
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

export const isDeepEqual = (a: unknown, b: unknown): boolean => {
  if (a === b) return true;

  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!isDeepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  if (!isRecord(a) || !isRecord(b)) return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!isDeepEqual(a[key], b[key])) return false;
  }

  return true;
};

export const useStableValue = <T>(value: T): T => {
  const prevRef = useRef<T>(value);
  if (!isDeepEqual(prevRef.current, value)) {
    prevRef.current = value;
  }
  return prevRef.current;
};
