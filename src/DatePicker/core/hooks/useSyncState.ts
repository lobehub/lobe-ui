import * as React from 'react';

/**
 * Sync value with state.
 * This should only used for internal which not affect outside calculation.
 * Since it's not safe for suspense.
 */
export default function useSyncState<T>(
  defaultValue: T,
  controlledValue?: T,
): [getter: (useControlledValueFirst?: boolean) => T, setter: (nextValue: T) => void, value: T] {
  const valueRef = React.useRef(defaultValue);
  const [, forceUpdate] = React.useState({});

  const getter = (useControlledValueFirst?: boolean) =>
    useControlledValueFirst && controlledValue !== undefined ? controlledValue : valueRef.current;

  const setter = (nextValue: T) => {
    valueRef.current = nextValue;
    forceUpdate({});
  };

  return [getter, setter, getter(true)];
}
