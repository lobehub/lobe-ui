import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { ChatItemProps } from '@/chat/ChatItem';
import { formatTime } from '@/utils/formatTime';

import { useStyles } from '../style';

export interface TitleProps {
  avatar: ChatItemProps['avatar'];
  placement?: ChatItemProps['placement'];
  showTitle?: ChatItemProps['showTitle'];
  time?: ChatItemProps['time'];
  titleAddon?: ChatItemProps['titleAddon'];
}

const Title = memo<TitleProps>(({ showTitle, placement, time, avatar, titleAddon }) => {
  const { styles } = useStyles({ placement, showTitle, time });

  return (
    <Flexbox
      align={'center'}
      className={styles.name}
      direction={placement === 'left' ? 'horizontal' : 'horizontal-reverse'}
      gap={4}
    >
      {showTitle ? avatar.title || 'untitled' : undefined}
      {showTitle ? titleAddon : undefined}
      {time && <time>{formatTime(time)}</time>}
    </Flexbox>
  );
});

export default Title;
