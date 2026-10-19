import { Timer } from 'lucide-react';
import { type FC } from 'react';

import Divider from '@/Divider';
import Icon from '@/Icon';
import { styleProps } from '@/styles/stylex/props';
import Tag from '@/Tag';

import { chatChatListClasses } from '../stable';
import { styles } from '../style';

interface HistoryDividerProps {
  enable?: boolean;
  text?: string;
}

const HistoryDivider: FC<HistoryDividerProps> = ({ enable, text }) => {
  if (!enable) return null;

  return (
    <div {...styleProps(styles.historyDivider, chatChatListClasses('history-divider'))}>
      <Divider style={{ marginBlock: 16 }}>
        <Tag icon={<Icon icon={Timer} />}>{text || 'History Message'}</Tag>
      </Divider>
    </div>
  );
};

export default HistoryDivider;
