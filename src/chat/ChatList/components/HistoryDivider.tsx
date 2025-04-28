import { Divider } from 'antd';
import { Timer } from 'lucide-react';
import { memo } from 'react';

import Icon from '@/Icon';
import Tag from '@/Tag';

interface HistoryDividerProps {
  enable?: boolean;
  text?: string;
}

const HistoryDivider = memo<HistoryDividerProps>(({ enable, text }) => {
  if (!enable) return null;

  return (
    <div style={{ padding: '0 20px' }}>
      <Divider>
        <Tag icon={<Icon icon={Timer} />}>{text || 'History Message'}</Tag>
      </Divider>
    </div>
  );
});

export default HistoryDivider;
