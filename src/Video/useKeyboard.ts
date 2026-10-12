import type { KeyboardEvent as ReactKeyboardEvent } from 'react';

import type { VideoStore } from './store';

export const DEFAULT_PLAYBACK_RATES = [0.5, 1, 1.5, 2];

const nextRate = (rates: number[], current: number, direction: 1 | -1) => {
  const index = rates.indexOf(current);
  const from = index === -1 ? rates.findIndex((rate) => rate >= current) : index;
  const next = Math.min(
    Math.max((from === -1 ? rates.length - 1 : from) + direction, 0),
    rates.length - 1,
  );
  return rates[next];
};

export const handleVideoKey = (
  event: KeyboardEvent | ReactKeyboardEvent,
  store: VideoStore,
  rates: number[] = DEFAULT_PLAYBACK_RATES,
) => {
  if (event.altKey || event.ctrlKey || event.metaKey) return false;
  const target = event.target as HTMLElement | null;
  if (target?.closest?.('input, textarea, [contenteditable="true"]')) return false;
  if (target instanceof HTMLButtonElement && (event.key === ' ' || event.key === 'Enter'))
    return false;
  const state = store.getState();
  if (state.status !== 'ready') return false;

  switch (event.key.toLowerCase()) {
    case ' ':
    case 'k': {
      store.toggle();
      return true;
    }
    case ',': {
      store.step(-1);
      return true;
    }
    case '.': {
      store.step(1);
      return true;
    }
    case 'arrowleft': {
      store.seek(state.time - (event.shiftKey ? 5 : 1));
      return true;
    }
    case 'arrowright': {
      store.seek(state.time + (event.shiftKey ? 5 : 1));
      return true;
    }
    case 'j': {
      store.setRate(nextRate(rates, state.rate, -1));
      return true;
    }
    case 'l': {
      store.setRate(nextRate(rates, state.rate, 1));
      return true;
    }
    case 'm': {
      store.toggleMute();
      return true;
    }
    case 'c': {
      store.setCaptions(!state.captions);
      return true;
    }
    case 'f': {
      store.toggleFullscreen();
      return true;
    }
    default: {
      return false;
    }
  }
};
