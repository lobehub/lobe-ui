import { type RefObject, useEffect, useState } from 'react';

import { useEventCallback } from '@/hooks/useEventCallback';

export const useFullscreen = (rootRef: RefObject<HTMLDivElement | null>) => {
  const [fullscreen, setFullscreen] = useState(false);
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const sync = () => setFullscreen(document.fullscreenElement === rootRef.current);
    document.addEventListener('fullscreenchange', sync);
    return () => document.removeEventListener('fullscreenchange', sync);
  }, [rootRef]);
  const toggle = useEventCallback(() => {
    const node = rootRef.current;
    if (!node || typeof document === 'undefined') return;
    if (document.fullscreenElement) void document.exitFullscreen?.();
    else void node.requestFullscreen?.();
  });
  return [fullscreen, toggle] as const;
};
