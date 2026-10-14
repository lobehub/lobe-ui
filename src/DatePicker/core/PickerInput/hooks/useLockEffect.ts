import * as React from 'react';

import { useLayoutUpdateEffect } from '../../hooks/react';
import { raf } from '../../utils/common';

/**
 * Trigger `callback` immediately when `condition` is `true`.
 * But trigger `callback` in next frame when `condition` is `false`.
 */
export default function useLockEffect(
  condition: boolean | undefined,
  callback: (next: boolean | undefined) => void,
  delayFrames = 1,
) {
  const callbackRef = React.useRef(callback);
  callbackRef.current = callback;

  useLayoutUpdateEffect(() => {
    if (condition) {
      callbackRef.current(condition);
    } else {
      const id = raf(() => {
        callbackRef.current(condition);
      }, delayFrames);

      return () => {
        raf.cancel(id);
      };
    }
  }, [condition]);
}
