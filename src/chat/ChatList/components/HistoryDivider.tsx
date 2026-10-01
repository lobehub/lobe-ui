import { Timer } from 'lucide-react';
import { type FC } from 'react';

import Divider from '@/base-ui/Divider';
import Tag from '@/base-ui/Tag';
import Icon from '@/Icon';

interface HistoryDividerProps {
  enable?: boolean;
  text?: string;
}

const HistoryDivider: FC<HistoryDividerProps> = ({ enable, text }) => {
  if (!enable) return null;

  return (
    <div style={{ padding: '0 20px' }}>
      <Divider style={{ marginBlock: 16 }}>
        <Tag icon={<Icon icon={Timer} />}>{text || 'History Message'}</Tag>
      </Divider>
    </div>
  );
};

export default HistoryDivider;
