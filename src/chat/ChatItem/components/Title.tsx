import { type FC } from 'react';

import { Flexbox } from '@/Flex';
import { ChatItemProps } from '@/chat/ChatItem';
import { formatTime } from '@/utils/formatTime';

import { styles } from '../style';

export interface TitleProps {
  avatar: ChatItemProps['avatar'];
  placement?: ChatItemProps['placement'];
  showTitle?: ChatItemProps['showTitle'];
  time?: ChatItemProps['time'];
  titleAddon?: ChatItemProps['titleAddon'];
}

const Title: FC<TitleProps> = ({ showTitle, placement = 'left', time, avatar, titleAddon }) => {
  return (
    <Flexbox
      align={'center'}
      className={placement === 'left' ? styles.nameLeft : styles.nameRight}
      direction={placement === 'left' ? 'horizontal' : 'horizontal-reverse'}
      gap={4}
    >
      {showTitle ? avatar.title || 'untitled' : undefined}
      {showTitle ? titleAddon : undefined}
      {time && <time>{formatTime(time)}</time>}
    </Flexbox>
  );
};

export default Title;
