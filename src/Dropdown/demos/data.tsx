import { type DropdownProps, Icon } from '@lobehub/ui';
import { BoxSelectIcon, CopyIcon, ZoomInIcon, ZoomOutIcon } from 'lucide-react';

export const menu: DropdownProps['menu'] = {
  items: [
    {
      icon: <Icon icon={CopyIcon} />,
      key: 'copy',
      label: '复制',
    },
    {
      icon: <Icon icon={BoxSelectIcon} />,
      key: 'selectAll',
      label: '选择全部',
    },
    { icon: <Icon icon={ZoomInIcon} />, key: 'zoomIn', label: '放大' },
    { icon: <Icon icon={ZoomOutIcon} />, key: 'zoomOut', label: '缩小' },
    {
      children: [
        { key: '1', label: '文件1' },
        { key: '2', label: '文件2' },
      ],
      key: 'recent',
      label: '最近打开的文件...',
    },
  ],
};
