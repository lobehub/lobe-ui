import { Loader2 } from 'lucide-react';
import type { FC } from 'react';

import { type ChatItemProps } from '@/chat/ChatItem';
import { Flexbox } from '@/Flex';
import Icon from '@/Icon';
import { styleProps } from '@/styles/stylex/props';

import { chatChatItemClasses } from '../stable';
import { styles } from '../style';

export interface LoadingProps {
  loading?: ChatItemProps['loading'];
  placement?: ChatItemProps['placement'];
}

const Loading: FC<LoadingProps> = ({ loading, placement = 'left' }) => {
  if (!loading) return null;

  return (
    <Flexbox
      align={'center'}
      height={16}
      justify={'center'}
      width={16}
      {...styleProps(
        [styles.loading, placement === 'left' ? styles.loadingLeft : styles.loadingRight],
        chatChatItemClasses('loading'),
      )}
    >
      <Icon spin icon={Loader2} size={{ size: 12, strokeWidth: 3 }} />
    </Flexbox>
  );
};

export default Loading;
