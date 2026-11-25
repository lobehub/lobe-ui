'use client';

import type { Dialog } from '@base-ui/react/dialog';
import type { RefObject } from 'react';
import { useCallback, useRef } from 'react';

/** Same contract as Base UI `Dialog.Popup`'s `initialFocus`. */
export type DialogInitialFocus = Dialog.Popup.Props['initialFocus'];

/**
 * Marker read by the global focus ring: skip the marked element itself, unlike `"off"`, which
 * also covers every descendant.
 */
export const FOCUS_RING_SELF_OFF = 'self-off' as const;

const FOCUSABLE_SELECTOR =
  'a[href], button, input, select, textarea, [tabindex], [contenteditable]:not([contenteditable="false"])';

/** Input types that take typed text; the rest (checkbox, button, file, …) behave like buttons. */
const NON_TEXT_INPUT_TYPES = new Set([
  'button',
  'checkbox',
  'color',
  'file',
  'hidden',
  'image',
  'radio',
  'range',
  'reset',
  'submit',
]);

const findFirstFocusable = (root: HTMLElement): HTMLElement | undefined =>
  [...root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)].find(
    (element) =>
      element.tabIndex >= 0 &&
      !(element as HTMLButtonElement).disabled &&
      !element.closest('[inert], [hidden]'),
  );

const isTextEntry = (element: HTMLElement | undefined): boolean => {
  if (!element) return false;
  if (element instanceof HTMLInputElement) return !NON_TEXT_INPUT_TYPES.has(element.type);
  return (
    element instanceof HTMLTextAreaElement ||
    element instanceof HTMLSelectElement ||
    element.isContentEditable ||
    element.matches('[contenteditable]:not([contenteditable="false"])')
  );
};

/**
 * Focus the dialog popup itself on open unless the caller picks a target.
 *
 * Base UI focuses the first tabbable element by default, which in our headers is the close
 * button. Any key press after opening (even Shift or the macOS screenshot shortcut), or opening
 * from a non-focusable trigger, makes that button `:focus-visible`, so mouse users see a ring on
 * the close button. Focusing the popup matches Base UI's touch behavior, lets screen readers
 * announce the dialog title instead of "Close", and leaves the first Tab landing on the close
 * button. The popup opts out of the ring because outlining the whole dialog is no better.
 *
 * A dialog whose first focusable element is a text field keeps Base UI's default instead: with no
 * close button ahead of it (`closable={false}`), that field was focused on open before, and a
 * rename or prompt dialog should stay ready to type into.
 */
export const useDialogInitialFocus = (
  initialFocus?: DialogInitialFocus,
): {
  focusRingProps: { 'data-lobe-focus-ring': typeof FOCUS_RING_SELF_OFF };
  initialFocus: NonNullable<DialogInitialFocus>;
  popupRef: RefObject<HTMLDivElement | null>;
} => {
  const popupRef = useRef<HTMLDivElement | null>(null);
  const defaultInitialFocus = useCallback(() => {
    const popup = popupRef.current;
    if (!popup) return true;
    return isTextEntry(findFirstFocusable(popup)) ? true : popup;
  }, []);
  return {
    focusRingProps: { 'data-lobe-focus-ring': FOCUS_RING_SELF_OFF } as const,
    initialFocus: initialFocus ?? defaultInitialFocus,
    popupRef,
  };
};
