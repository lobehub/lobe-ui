import React from 'react';

import { useControlledState, useEvent } from '../../hooks/react';
import { raf } from '../../utils/common';

/**
 * Will be `true` immediately for next effect.
 * But will be `false` for a delay of effect.
 */
export default function useDelayState<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (next: T) => void,
): [state: T, setState: (nextState: T, immediately?: boolean) => void] {
  const [state, setState] = useControlledState<T>(defaultValue, value);

  // Need force update to ensure React re-render
  const [, forceUpdate] = React.useState({});

  const triggerUpdate = useEvent((nextState: T) => {
    setState(nextState);
    forceUpdate({});
  });

  const nextValueRef = React.useRef<T>(value!);

  // ============================= Update =============================
  const rafRef = React.useRef<number | undefined>(undefined);
  const cancelRaf = () => {
    raf.cancel(rafRef.current!);
  };

  const doUpdate = useEvent(() => {
    triggerUpdate(nextValueRef.current);

    if (onChange && state !== nextValueRef.current) {
      onChange(nextValueRef.current);
    }
  });

  const updateValue = useEvent((next: T, immediately?: boolean) => {
    cancelRaf();

    nextValueRef.current = next;

    if (next || immediately) {
      doUpdate();
    } else {
      rafRef.current = raf(doUpdate);
    }
  });

  React.useEffect(() => cancelRaf, []);

  return [state, updateValue];
}
