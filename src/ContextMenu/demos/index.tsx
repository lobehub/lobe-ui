import { ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';
import { ContextMenu, Icon } from '@unitalkai/ui';
import { BoxSelectIcon, CopyIcon } from 'lucide-react';
import { Flexbox } from 'react-layout-kit';

export default () => {
  return (
    <ContextMenu
      menu={{
        items: [
          {
            icon: <Icon icon={CopyIcon} size={'small'} />,
            key: 'copy',
            label: '复制',
          },
          {
            icon: <Icon icon={BoxSelectIcon} size={'small'} />,
            key: 'selectAll',
            label: '选择全部',
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
        ],
      }}
    >
      <Flexbox
        align={'center'}
        justify={'center'}
        style={{ height: '100%', minHeight: 200, width: '100%' }}
      >
        RightClick
      </Flexbox>
    </ContextMenu>
  );
};
