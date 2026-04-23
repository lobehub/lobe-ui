import { ActionIcon, DropdownMenu } from '@lobehub/ui';
import {
  CopyIcon,
  HashIcon,
  Maximize2Icon,
  MoreHorizontalIcon,
  PencilIcon,
  SparklesIcon,
  StarIcon,
  TrashIcon,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import type { DropdownItem } from '../type';

export default () => {
  const [fullWidth, setFullWidth] = useState(false);

  const items = useMemo<DropdownItem[]>(
    () => [
      { icon: <StarIcon />, key: 'favorite', label: '收藏' },
      { icon: <SparklesIcon />, key: 'smart-rename', label: '智能重命名' },
      { icon: <PencilIcon />, key: 'rename', label: '重命名' },
      { type: 'divider' },
      { icon: <HashIcon />, key: 'copy-id', label: '复制会话 ID' },
      { icon: <CopyIcon />, key: 'copy', label: '复制' },
      { type: 'divider' },
      {
        checked: fullWidth,
        icon: <Maximize2Icon />,
        key: 'full-width',
        label: '全宽显示',
        onCheckedChange: setFullWidth,
        type: 'switch',
      },
      { type: 'divider' },
      { danger: true, icon: <TrashIcon />, key: 'delete', label: '删除' },
    ],
    [fullWidth],
  );

  return (
    <DropdownMenu items={items}>
      <ActionIcon icon={MoreHorizontalIcon} />
    </DropdownMenu>
  );
};
