import { useCallback, useEffect, useRef } from 'react';

import { isEditableTarget } from './utils';

interface UseKeyboardNavigationProps {
  isOpen: boolean;
}

export const useKeyboardNavigation = ({ isOpen }: UseKeyboardNavigationProps) => {
  const listRef = useRef<HTMLDivElement | null>(null);

  const dispatchListKey = useCallback((key: string) => {
    const list = listRef.current;
    if (!list) return;
    const event = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key });
    list.dispatchEvent(event);
  }, []);

  // Auto-highlight first item when menu opens
  useEffect(() => {
    if (!isOpen) return;
    const raf = requestAnimationFrame(() => {
      const list = listRef.current;
      if (!list) return;
      if (list.querySelector('[data-highlighted]')) return;
      if (!list.querySelector('[role="option"]')) return;
      dispatchListKey('ArrowDown');
    });
    return () => cancelAnimationFrame(raf);
  }, [dispatchListKey, isOpen]);

  // Global keyboard navigation when menu is open
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!event.isTrusted) return;
      const list = listRef.current;
      if (!list) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (!isEditableTarget(target) || list.contains(target)) return;
      if (!list.querySelector('[role="option"]')) return;
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp' && event.key !== 'Enter') return;
      if (event.key === 'Enter' && !list.querySelector('[data-highlighted]')) return;
      event.preventDefault();
      dispatchListKey(event.key);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [dispatchListKey, isOpen]);

  return { listRef };
};
