import { useMemo } from 'react';

import type { EditorSlashMenuGroup, EditorSlashMenuItems, EditorSlashMenuOption } from './type';
import { isGroup } from './utils';

export const useNormalizedItems = (items: EditorSlashMenuItems) => {
  const resolvedItems = useMemo(() => {
    const hasAnyGroup = items.some(isGroup);
    if (!hasAnyGroup) return items as EditorSlashMenuOption[];

    // Normalize: keep order, but ensure all entries are groups.
    const groups: EditorSlashMenuGroup[] = [];
    let buffer: EditorSlashMenuOption[] = [];

    const flush = () => {
      if (buffer.length) {
        groups.push({ items: buffer });
        buffer = [];
      }
    };

    for (const entry of items) {
      if (isGroup(entry)) {
        flush();
        groups.push(entry);
      } else {
        buffer.push(entry);
      }
    }
    flush();

    return groups;
  }, [items]);

  const hasAnyIcon = useMemo(() => {
    const walk = (entry: EditorSlashMenuOption | EditorSlashMenuGroup): boolean => {
      if (isGroup(entry)) return entry.items.some(walk as any);
      return Boolean(entry.icon);
    };
    return items.some(walk as any);
  }, [items]);

  return { hasAnyIcon, resolvedItems };
};
