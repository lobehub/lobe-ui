import type { KeyboardEvent } from 'react';

export const isPressEnter = (event: KeyboardEvent) =>
  event.key === 'Enter' && !event.nativeEvent.isComposing && event.keyCode !== 229;
