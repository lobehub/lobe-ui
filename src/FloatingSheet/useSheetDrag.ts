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

  // Store latest callbacks in refs to avoid stale closures in document listeners
  const onDragChangeRef = useRef(onDragChange);
  const onDragEndRef = useRef(onDragEnd);
  onDragChangeRef.current = onDragChange;
  onDragEndRef.current = onDragEnd;

  useEffect(() => {
    if (!draggingRef.current) return;

    const onMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      const draggedDistance = startY.current - e.clientY;
      onDragChangeRef.current(draggedDistance);
    };

    const onMouseUp = (e: MouseEvent) => {
      draggingRef.current = false;
      setIsDragging(false);

      const draggedDistance = startY.current - e.clientY;
      const elapsed = Date.now() - startTime.current;
      const velocity = elapsed > 0 ? Math.abs(draggedDistance) / elapsed : 0;
      onDragEndRef.current(draggedDistance, velocity);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging]);

  const onMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!enabled) return;
      if (event.button !== 0) return; // left click only

      const target = event.target as HTMLElement;
      if (target.closest?.('[data-no-drag]')) return;

      event.preventDefault(); // prevent text selection during drag

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
      onMouseDown,
    },
  };
}
