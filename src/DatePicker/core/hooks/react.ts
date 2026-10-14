import {
  type DependencyList,
  type RefObject,
  type SetStateAction,
  useCallback,
  useInsertionEffect,
  useLayoutEffect as useReactLayoutEffect,
  useReducer,
  useRef,
  useState,
} from 'react';

export const useEvent = <T extends (...args: any[]) => any>(callback: T): T => {
  const callbackRef = useRef(callback);
  useInsertionEffect(() => {
    callbackRef.current = callback;
  });
  return useCallback((...args: Parameters<T>) => callbackRef.current?.(...args), []) as T;
};

export const useLayoutEffect = (
  callback: (firstMount: boolean) => void | (() => void),
  deps?: DependencyList,
) => {
  const firstMountRef = useRef(true);

  useReactLayoutEffect(() => callback(firstMountRef.current), deps);

  useReactLayoutEffect(() => {
    firstMountRef.current = false;
    return () => {
      firstMountRef.current = true;
    };
  }, []);
};

export const useLayoutUpdateEffect = (
  callback: () => void | (() => void),
  deps?: DependencyList,
) => {
  useLayoutEffect((firstMount) => {
    if (!firstMount) return callback();
  }, deps);
};

export const useControlledState = <T>(
  defaultStateValue: T | (() => T),
  value?: T,
): [T, (next: SetStateAction<T>) => void] => {
  const [innerValue, setInnerValue] = useState(defaultStateValue);
  const mergedValue = value === undefined ? innerValue : value;

  useLayoutEffect(
    (firstMount) => {
      if (!firstMount) setInnerValue(value as T);
    },
    [value],
  );

  return [mergedValue, setInnerValue];
};

export const useLatestState = <T>(
  defaultValue: T,
): [() => T, (next: T | ((prev: T) => T)) => void] => {
  const [, forceUpdate] = useReducer((count: number) => count + 1, 0);
  const valueRef = useRef(defaultValue);
  const getValue = useEvent(() => valueRef.current);
  const setValue = useEvent((next: T | ((prev: T) => T)) => {
    valueRef.current =
      typeof next === 'function' ? (next as (prev: T) => T)(valueRef.current) : next;
    forceUpdate();
  });
  return [getValue, setValue];
};

export const useResizeObserver = (
  ref: RefObject<HTMLElement | null>,
  onResize: (element: HTMLElement) => void,
  enabled = true,
) => {
  const handleResize = useEvent(onResize);

  useReactLayoutEffect(() => {
    const element = ref.current;
    if (!enabled || !element || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => handleResize(element));
    observer.observe(element);
    return () => observer.disconnect();
  }, [enabled, handleResize, ref]);
};
