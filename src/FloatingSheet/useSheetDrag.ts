import { useCallback, useEffect, useRef, useState } from 'react';

interface UseSheetDragOptions {
  enabled: boolean;
  onDragChange: (draggedDistance: number) => void;
  onDragEnd: (draggedDistance: number, velocity: number) => void;
}

export function useSheetDrag({ onDragChange, onDragEnd, enabled }: UseSheetDragOptions) {
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);
  const startTime = useRef(0);
  const draggingRef = useRef(false);
  const pointerIdRef = useRef<number | null>(null);
  const captureTargetRef = useRef<HTMLElement | null>(null);

  // Store latest callbacks in refs to avoid stale closures in document listeners
  const onDragChangeRef = useRef(onDragChange);
  const onDragEndRef = useRef(onDragEnd);
  onDragChangeRef.current = onDragChange;
  onDragEndRef.current = onDragEnd;

  useEffect(() => {
    if (!draggingRef.current) return;

    // A second finger landing mid-drag must not steer the sheet.
    const isActivePointer = (e: PointerEvent) =>
      pointerIdRef.current === null || e.pointerId === pointerIdRef.current;

    const releaseCapture = () => {
      const target = captureTargetRef.current;
      const pointerId = pointerIdRef.current;
      if (target && pointerId !== null && target.hasPointerCapture?.(pointerId)) {
        target.releasePointerCapture(pointerId);
      }
      captureTargetRef.current = null;
      pointerIdRef.current = null;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isActivePointer(e)) return;
      // Touch moves are non-cancelable once the gesture is committed.
      if (e.cancelable) e.preventDefault();
      const draggedDistance = startY.current - e.clientY;
      onDragChangeRef.current(draggedDistance);
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!isActivePointer(e)) return;
      draggingRef.current = false;
      setIsDragging(false);

      const draggedDistance = startY.current - e.clientY;
      const elapsed = Date.now() - startTime.current;
      const velocity = elapsed > 0 ? Math.abs(draggedDistance) / elapsed : 0;
      releaseCapture();
      onDragEndRef.current(draggedDistance, velocity);
    };

    // The browser can revoke an in-flight gesture (scroll takeover, an
    // incoming call). Settle back rather than leaving the sheet stuck mid-drag.
    const onPointerCancel = (e: PointerEvent) => {
      if (!isActivePointer(e)) return;
      draggingRef.current = false;
      setIsDragging(false);
      releaseCapture();
      onDragEndRef.current(0, 0);
    };

    document.addEventListener('pointermove', onPointerMove, { passive: false });
    document.addEventListener('pointerup', onPointerUp);
    document.addEventListener('pointercancel', onPointerCancel);
    return () => {
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
      document.removeEventListener('pointercancel', onPointerCancel);
    };
  }, [isDragging]);

  const onPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!enabled) return;
      if (!event.isPrimary) return;
      if (event.button !== 0) return; // left click / first contact only

      const target = event.target as HTMLElement;
      if (target.closest?.('[data-no-drag]')) return;

      event.preventDefault(); // prevent text selection during drag

      const handle = event.currentTarget;
      pointerIdRef.current = event.pointerId;
      captureTargetRef.current = handle;
      // Keeps the drag alive when the finger leaves the handle.
      handle.setPointerCapture?.(event.pointerId);

      startY.current = event.clientY;
      startTime.current = Date.now();
      draggingRef.current = true;
      setIsDragging(true);
    },
    [enabled],
  );

  return {
    isDragging,
    handleProps: {
      onPointerDown,
    },
  };
}
