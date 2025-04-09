'use client';

import { Copy, Edit, RotateCw, Trash } from 'lucide-react';
import { useMemo } from 'react';

import type { ActionIconGroupItemType } from '@/ActionIconGroup';

interface ChatListActionsBar {
  copy: ActionIconGroupItemType;
  del: ActionIconGroupItemType;
  divider: { type: 'divider' };
  edit: ActionIconGroupItemType;
  regenerate: ActionIconGroupItemType;
}

export const useChatListActionsBar = (text?: {
  copy?: string;
  delete?: string;
  edit?: string;
  regenerate?: string;
}): ChatListActionsBar => {
  return useMemo(
    () => ({
      copy: {
        icon: Copy,
        key: 'copy',
        label: text?.copy || 'Copy',
      },
      del: {
        icon: Trash,
        key: 'del',
        label: text?.delete || 'Delete',
      },
      divider: {
        type: 'divider',
      },
      edit: {
        icon: Edit,
        key: 'edit',
        label: text?.edit || 'Edit',
      },
      regenerate: {
        icon: RotateCw,
        key: 'regenerate',
        label: text?.regenerate || 'Regenerate',
      },
    }),
    [text],
  );
};
