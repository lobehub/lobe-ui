import { useCallback, useEffect, useRef, useState } from 'react';

import { type LayerTier } from './constants';
import { acquireLayerZIndex } from './manager';

export interface LayerZIndexResult<T extends HTMLElement = HTMLElement> {
  ref: (node: T | null) => void;
  zIndex: number | undefined;
}

export function useLayerZIndex<T extends HTMLElement = HTMLElement>(
  tier: LayerTier,
  explicitZIndex?: number,
): LayerZIndexResult<T> {
  const [zIndex, setZIndex] = useState<number | undefined>(undefined);

  const stateRef = useRef<{
    tier: LayerTier;
    explicit: number | undefined;
    node: T | null;
    observer: MutationObserver | null;
    prevOpen: boolean;
  }>({
    tier,
    explicit: explicitZIndex,
    node: null,
    observer: null,
    prevOpen: false,
  });

  // Keep ref in sync with latest props so prop changes after mount are respected.
  stateRef.current.tier = tier;
  stateRef.current.explicit = explicitZIndex;

  const ref = useCallback((node: T | null) => {
    if (node === stateRef.current.node) return;
    stateRef.current.observer?.disconnect();
    stateRef.current.observer = null;
    stateRef.current.node = node;
    stateRef.current.prevOpen = false;
    if (!node) return;
    if (stateRef.current.explicit !== undefined) return;
    const handle = () => {
      const isOpen = node.hasAttribute('data-open');
      if (isOpen && !stateRef.current.prevOpen) {
        setZIndex(acquireLayerZIndex(stateRef.current.tier));
      }
      stateRef.current.prevOpen = isOpen;
    };
    handle();
    const observer = new MutationObserver(handle);
    observer.observe(node, {
      attributes: true,
      attributeFilter: ['data-open', 'data-closed'],
    });
    stateRef.current.observer = observer;
  }, []);

  useEffect(
    () => () => {
      stateRef.current.observer?.disconnect();
    },
    [],
  );

  return { zIndex: stateRef.current.explicit ?? zIndex, ref };
}
