'use client';

import type { Dialog } from '@base-ui/react/dialog';
import type { RefObject } from 'react';
import { useRef } from 'react';

/** Same contract as Base UI `Dialog.Popup`'s `initialFocus`. */
export type DialogInitialFocus = Dialog.Popup.Props['initialFocus'];

/**
 * Marker read by the global focus ring: skip the marked element itself, unlike `"off"`, which
 * also covers every descendant.
 */
export const FOCUS_RING_SELF_OFF = 'self-off' as const;

/**
 * Focus the dialog popup itself on open unless the caller picks a target.
 *
 * Base UI focuses the first tabbable element by default, which in our headers is the close
 * button. Any key press after opening (even Shift or the macOS screenshot shortcut), or opening
 * from a non-focusable trigger, makes that button `:focus-visible`, so mouse users see a ring on
 * the close button. Focusing the popup matches Base UI's touch behavior, lets screen readers
 * announce the dialog title instead of "Close", and leaves the first Tab landing on the close
 * button. The popup opts out of the ring because outlining the whole dialog is no better.
 */
export const useDialogInitialFocus = (
  initialFocus?: DialogInitialFocus,
): {
  focusRingProps: { 'data-lobe-focus-ring': typeof FOCUS_RING_SELF_OFF };
  initialFocus: NonNullable<DialogInitialFocus>;
  popupRef: RefObject<HTMLDivElement | null>;
} => {
  const popupRef = useRef<HTMLDivElement | null>(null);
  return {
    focusRingProps: { 'data-lobe-focus-ring': FOCUS_RING_SELF_OFF } as const,
    initialFocus: initialFocus ?? popupRef,
    popupRef,
  };
};
