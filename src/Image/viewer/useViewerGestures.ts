import type { MouseEvent, PointerEvent } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { Point } from './geometry';
import type { WheelLikeEvent } from './useZoomPan';

const DRAG_THRESHOLD = 4;
const DOUBLE_CLICK_WINDOW = 250;

export type ViewerCursor = 'grab' | 'grabbing' | 'zoom-out';

export interface UseViewerGesturesOptions {
  dragBy: (delta: Point) => void;
  dragEnd: () => void;
  handleDoubleClick: (point: Point) => void;
  handleWheel: (event: WheelLikeEvent) => void;
  isZoomed: boolean;
  onClose: () => void;
  reset: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
}

export interface UseViewerGesturesResult {
  cursor: ViewerCursor;
  imageRef: (node: HTMLImageElement | null) => void;
  onImageClick: (event: MouseEvent<HTMLElement>) => void;
  onImageDoubleClick: (event: MouseEvent<HTMLElement>) => void;
  onPointerDown: (event: PointerEvent<HTMLElement>) => void;
  onPointerFinish: (event: PointerEvent<HTMLElement>) => void;
  onPointerMove: (event: PointerEvent<HTMLElement>) => void;
  onSurfaceClick: () => void;
  popupRef: (node: HTMLElement | null) => void;
}

interface DragState {
  id: number;
  last: Point;
  panning: boolean;
  start: Point;
}

const capturePointer = (node: Element, pointerId: number) => {
  if (typeof node.setPointerCapture === 'function') node.setPointerCapture(pointerId);
};

const isTypingTarget = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || ['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName));

export const useViewerGestures = ({
  dragBy,
  dragEnd,
  handleDoubleClick,
  handleWheel,
  isZoomed,
  onClose,
  reset,
  zoomIn,
  zoomOut,
}: UseViewerGesturesOptions): UseViewerGesturesResult => {
  const [popup, setPopup] = useState<HTMLElement | null>(null);
  const [panning, setPanning] = useState(false);

  const imageNodeRef = useRef<HTMLImageElement | null>(null);
  const dragRef = useRef<DragState | null>(null);
  const movedRef = useRef(false);
  const pendingCloseRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelPendingClose = useCallback(() => {
    if (pendingCloseRef.current === null) return;
    clearTimeout(pendingCloseRef.current);
    pendingCloseRef.current = null;
  }, []);

  useEffect(() => cancelPendingClose, [cancelPendingClose]);

  const imageRef = useCallback((node: HTMLImageElement | null) => {
    imageNodeRef.current = node;
  }, []);

  useEffect(() => {
    if (!popup) return;
    const listener = (event: globalThis.WheelEvent) => handleWheel(event);
    popup.addEventListener('wheel', listener, { passive: false });
    return () => popup.removeEventListener('wheel', listener);
  }, [handleWheel, popup]);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.defaultPrevented) return;
      if (isTypingTarget(event.target)) return;
      switch (event.key) {
        case '+':
        case '=': {
          zoomIn();
          break;
        }
        case '-': {
          zoomOut();
          break;
        }
        case '0': {
          reset();
          break;
        }
        default: {
          return;
        }
      }
      event.preventDefault();
    };
    document.addEventListener('keydown', listener);
    return () => document.removeEventListener('keydown', listener);
  }, [reset, zoomIn, zoomOut]);

  const onPointerDown = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      if (event.button !== 0) return;
      const start = { x: event.clientX, y: event.clientY };
      const panEligible = isZoomed && event.target === imageNodeRef.current;
      movedRef.current = false;
      dragRef.current = { id: event.pointerId, last: start, panning: panEligible, start };
      if (!panEligible) return;
      capturePointer(event.target as Element, event.pointerId);
      setPanning(true);
    },
    [isZoomed],
  );

  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      const drag = dragRef.current;
      if (!drag || drag.id !== event.pointerId) return;
      const point = { x: event.clientX, y: event.clientY };
      if (Math.hypot(point.x - drag.start.x, point.y - drag.start.y) > DRAG_THRESHOLD) {
        movedRef.current = true;
      }
      if (drag.panning) dragBy({ x: point.x - drag.last.x, y: point.y - drag.last.y });
      drag.last = point;
    },
    [dragBy],
  );

  const onPointerFinish = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      const drag = dragRef.current;
      if (!drag || drag.id !== event.pointerId) return;
      dragRef.current = null;
      if (!drag.panning) return;
      setPanning(false);
      dragEnd();
    },
    [dragEnd],
  );

  const onSurfaceClick = useCallback(() => {
    if (movedRef.current) return;
    cancelPendingClose();
    onClose();
  }, [cancelPendingClose, onClose]);

  const onImageClick = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      cancelPendingClose();
      if (movedRef.current || isZoomed) return;
      pendingCloseRef.current = setTimeout(() => {
        pendingCloseRef.current = null;
        onClose();
      }, DOUBLE_CLICK_WINDOW);
    },
    [cancelPendingClose, isZoomed, onClose],
  );

  const onImageDoubleClick = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      cancelPendingClose();
      handleDoubleClick({ x: event.clientX, y: event.clientY });
    },
    [cancelPendingClose, handleDoubleClick],
  );

  return {
    cursor: isZoomed ? (panning ? 'grabbing' : 'grab') : 'zoom-out',
    imageRef,
    onImageClick,
    onImageDoubleClick,
    onPointerDown,
    onPointerFinish,
    onPointerMove,
    onSurfaceClick,
    popupRef: setPopup,
  };
};
