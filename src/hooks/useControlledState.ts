import { useState } from 'react';

import { useEventCallback } from './useEventCallback';

type Initial<T> = T | (() => T);

export interface ControlledStateOptions<T> {
  defaultValue?: Initial<T>;
  onChange?: (value: T, prevValue: T) => void;
  value?: T;
}

const resolveInitial = <T>(initial: Initial<T>): T =>
  typeof initial === 'function' ? (initial as () => T)() : initial;

export const useControlledState = <T>(
  defaultStateValue: Initial<T>,
  { defaultValue, onChange, value }: ControlledStateOptions<T> = {},
): [T, (next: T) => void] => {
  const [innerValue, setInnerValue] = useState<T>(() => {
    if (value !== undefined) return value;
    if (defaultValue !== undefined) return resolveInitial(defaultValue);
    return resolveInitial(defaultStateValue);
  });

  const mergedValue = value === undefined ? innerValue : value;

  const setValue = useEventCallback((next: T) => {
    setInnerValue(next);
    if (mergedValue !== next) onChange?.(next, mergedValue);
  });

  return [mergedValue, setValue];
};
