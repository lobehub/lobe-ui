import { type Ref, type RefCallback, useMemo } from 'react';

type MaybeRef<T> = Ref<T> | undefined;

const assignRef = <T>(ref: MaybeRef<T>, value: T | null): ReturnType<RefCallback<T>> => {
  if (typeof ref === 'function') return ref(value);
  if (ref) ref.current = value;
};

export const mergeRefs =
  <T>(refs: MaybeRef<T>[]): RefCallback<T> =>
  (value) => {
    const cleanups = refs.map((ref) => {
      const cleanup = assignRef(ref, value);
      return typeof cleanup === 'function' ? cleanup : () => assignRef(ref, null);
    });
    return () => {
      for (const cleanup of cleanups) cleanup();
    };
  };

export const useMergeRefs = <T>(refs: MaybeRef<T>[]): RefCallback<T> =>
  useMemo(() => mergeRefs(refs), refs);
