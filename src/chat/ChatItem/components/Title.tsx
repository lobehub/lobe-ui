import type { FC } from 'react';

import { type ChatItemProps } from '@/chat/ChatItem';
import { Flexbox } from '@/Flex';
import { styleProps } from '@/styles/stylex/props';
import { formatTime } from '@/utils/formatTime';

import { chatChatItemClasses } from '../stable';
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
      direction={placement === 'left' ? 'horizontal' : 'horizontal-reverse'}
      gap={4}
      {...styleProps(
        [styles.name, placement === 'left' ? styles.nameLeft : styles.nameRight],
        chatChatItemClasses('title'),
      )}
    >
      {showTitle ? avatar.title || 'untitled' : undefined}
      {showTitle ? titleAddon : undefined}
      {time && <time className={chatChatItemClasses('time')}>{formatTime(time)}</time>}
    </Flexbox>
  );
};

export default Title;
