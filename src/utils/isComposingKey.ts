import type { KeyboardEvent as ReactKeyboardEvent } from 'react';

// Safari fires compositionend before the keydown that ends it, so only keyCode 229 marks that key.
export const isComposingKey = (event: KeyboardEvent | ReactKeyboardEvent) => {
  const native = 'nativeEvent' in event ? event.nativeEvent : event;
  return native.isComposing || native.keyCode === 229;
};
