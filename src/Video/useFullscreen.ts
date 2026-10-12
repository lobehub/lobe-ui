'use client';

import { useEffect, useState } from 'react';

import type { VideoStore } from './store';

export const useFullscreen = (store: VideoStore) => {
  const [fullscreen, setFullscreen] = useState(false);
  useEffect(() => {
    const sync = () =>
      setFullscreen(Boolean(store.root) && document.fullscreenElement === store.root);
    sync();
    document.addEventListener('fullscreenchange', sync);
    return () => document.removeEventListener('fullscreenchange', sync);
  }, [store]);
  return fullscreen;
};
