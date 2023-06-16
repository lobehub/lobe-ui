import { ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';
import { ContextMenu, Icon } from '@lobehub/ui';
import { BoxSelectIcon, CopyIcon } from 'lucide-react';

export default () => {
  return (
    <div>
      <div>RightClick</div>
      <ContextMenu
        items={[
          {
            icon: <Icon icon={CopyIcon} size={'small'} />,
            key: 'copy',
            label: '复制',
            shortcut: ['meta', 'C'],
          },
          {
            icon: <Icon icon={BoxSelectIcon} size={'small'} />,
            key: 'selectAll',
            label: '选择全部',
            shortcut: ['meta', 'A'],
          },
          { icon: <ZoomInOutlined />, key: 'zoomIn', label: '放大' },
          { icon: <ZoomOutOutlined />, key: 'zoomOut', label: '缩小' },
          {
            children: [
              { key: '1', label: '文件1' },
              { key: '2', label: '文件2' },
            ],
            key: 'recent',
            label: '最近打开的文件...',
          },
        ]}
      />
    </div>
  );
};
