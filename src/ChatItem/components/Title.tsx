import { memo } from 'react';

import { ChatItemProps } from '@/ChatItem';
import { formatTime } from '@/utils/formatTime';

import { useStyles } from '../style';

export interface TitleProps {
  avatar: ChatItemProps['avatar'];
  placement?: ChatItemProps['placement'];
  showTitle?: ChatItemProps['showTitle'];
  time?: ChatItemProps['time'];
}

const Title = memo<TitleProps>(({ showTitle, placement, time, avatar }) => {
  const { styles } = useStyles({ placement, showTitle });

  return (
    <title className={styles.name}>
      {showTitle ? avatar.title || 'untitled' : undefined}
      {time && <time>{formatTime(time)}</time>}
    </title>
  );
});

export default Title;
