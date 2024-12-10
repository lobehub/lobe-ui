import { Loader2 } from 'lucide-react';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import Icon from '@/Icon';
import { ChatItemProps } from '@/chat/ChatItem';

import { useStyles } from '../style';

export interface LoadingProps {
  loading?: ChatItemProps['loading'];
  placement?: ChatItemProps['placement'];
}

const Loading = memo<LoadingProps>(({ loading, placement }) => {
  const { styles } = useStyles({ placement });

  if (!loading) return null;

  return (
    <Flexbox align={'center'} className={styles.loading} justify={'center'}>
      <Icon icon={Loader2} size={{ fontSize: 12, strokeWidth: 3 }} spin />
    </Flexbox>
  );
});

export default Loading;
