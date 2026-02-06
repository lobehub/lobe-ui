import { Loader2 } from 'lucide-react';
import type { FC } from 'react';

import { type ChatItemProps } from '@/chat/ChatItem';
import { Flexbox } from '@/Flex';
import Icon from '@/Icon';

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
      className={placement === 'left' ? styles.loadingLeft : styles.loadingRight}
      justify={'center'}
    >
      <Icon spin icon={Loader2} size={{ size: 12, strokeWidth: 3 }} />
    </Flexbox>
  );
};

export default Loading;
