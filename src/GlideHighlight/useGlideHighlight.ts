'use client';

import {
  type CSSProperties,
  type FocusEvent,
  type MouseEvent,
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import type { GlideHighlightBox, UseGlideHighlightOptions } from './type';

interface GlideState {
  box: GlideHighlightBox | null;
  gliding: boolean;
  visible: boolean;
}

const INITIAL: GlideState = { box: null, gliding: false, visible: false };

const isFocusVisible = (element: Element) => {
  try {
    return element.matches(':focus-visible');
  } catch {
    return true;
  }
};

const sameBox = (a: GlideHighlightBox | null, b: GlideHighlightBox) =>
  !!a && a.top === b.top && a.left === b.left && a.width === b.width && a.height === b.height;

export interface UseGlideHighlightResult<T extends HTMLElement> {
  /** Spread on the positioned container that holds the rows. */
  containerProps: {
    onBlurCapture: (event: FocusEvent<T>) => void;
    onFocusCapture: (event: FocusEvent<T>) => void;
    onMouseLeave: (event: MouseEvent<T>) => void;
    onMouseOver: (event: MouseEvent<T>) => void;
  };
  containerRef: RefObject<T | null>;
  /** True while the highlight slides between two rows instead of fading in. */
  gliding: boolean;
  /** Position and size of the highlight, relative to the container. */
  highlightStyle: CSSProperties;
  visible: boolean;
}

/**
 * Tracks the hovered or keyboard-focused row inside a container and reports the
 * box a single shared highlight layer should occupy, so the hover state glides
 * between rows instead of blinking on each one.
 */
export const useGlideHighlight = <T extends HTMLElement = HTMLDivElement>({
  disabled = false,
  rowSelector = '[data-glide-row]',
}: UseGlideHighlightOptions = {}): UseGlideHighlightResult<T> => {
  const containerRef = useRef<T | null>(null);
  const [state, setState] = useState<GlideState>(INITIAL);

  useEffect(() => {
    if (disabled)
      setState((current) => (current.visible ? { ...current, visible: false } : current));
  }, [disabled]);

  const moveTo = useCallback(
    (target: EventTarget | null) => {
      const container = containerRef.current;
      if (disabled || !container || !(target instanceof Element)) return;

      const row = target.closest(rowSelector);
      if (!(row instanceof HTMLElement) || !container.contains(row)) return;
      if (row.matches('[disabled], [aria-disabled="true"], [data-disabled]')) {
        setState((current) => (current.visible ? { ...current, visible: false } : current));
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const rowRect = row.getBoundingClientRect();
      const box: GlideHighlightBox = {
        height: rowRect.height,
        left: rowRect.left - containerRect.left - container.clientLeft + container.scrollLeft,
        top: rowRect.top - containerRect.top - container.clientTop + container.scrollTop,
        width: rowRect.width,
      };

      setState((current) =>
        current.visible && sameBox(current.box, box)
          ? current
          : { box, gliding: current.visible, visible: true },
      );
    },
    [disabled, rowSelector],
  );

  const hide = useCallback(() => {
    setState((current) => (current.visible ? { ...current, visible: false } : current));
  }, []);

  const onMouseOver = useCallback((event: MouseEvent<T>) => moveTo(event.target), [moveTo]);

  const onFocusCapture = useCallback(
    (event: FocusEvent<T>) => {
      if (isFocusVisible(event.target)) moveTo(event.target);
    },
    [moveTo],
  );

  const onBlurCapture = useCallback(
    (event: FocusEvent<T>) => {
      const next = event.relatedTarget;
      if (next instanceof Node && containerRef.current?.contains(next)) return;
      if (containerRef.current?.matches(':hover')) return;
      hide();
    },
    [hide],
  );

  const { box, gliding, visible } = state;

  return {
    containerProps: { onBlurCapture, onFocusCapture, onMouseLeave: hide, onMouseOver },
    containerRef,
    gliding,
    highlightStyle: box
      ? { height: box.height, left: box.left, top: box.top, width: box.width }
      : { height: 0, left: 0, top: 0, width: 0 },
    visible: visible && !!box,
  };
};
