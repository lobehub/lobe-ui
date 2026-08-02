import { useCallback } from 'react';

export const useFinalFocus = (openerFocusElement: HTMLElement | null) =>
  useCallback((): HTMLElement | false => {
    if (openerFocusElement?.isConnected) return openerFocusElement;
    return false;
  }, [openerFocusElement]);
