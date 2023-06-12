import { ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';
import { ContextMenu, Icon } from '@lobehub/ui';
import { BoxSelectIcon, CopyIcon } from 'lucide-react';

export default () => {
  return (
    <>
      <div>RightClick</div>
      <ContextMenu
        items={[
          {
            key: 'copy',
            label: '复制',
            icon: <Icon icon={CopyIcon} size={'small'} />,
            shortcut: ['meta', 'C'],
          },
          {
            key: 'selectAll',
            label: '选择全部',
            icon: <Icon icon={BoxSelectIcon} size={'small'} />,
            shortcut: ['meta', 'A'],
          },
          { label: '放大', key: 'zoomIn', icon: <ZoomInOutlined /> },
          { label: '缩小', key: 'zoomOut', icon: <ZoomOutOutlined /> },
          {
            label: '最近打开的文件...',
            key: 'recent',
            children: [
              { key: '1', label: '文件1' },
              { key: '2', label: '文件2' },
            ],
          },
        ]}
      />
    </>
  );
};
