import { Loader2 } from 'lucide-react';
import { memo } from 'react';

import { ChatItemProps } from '@/ChatItem';
import Icon from '@/Icon';

import { useStyles } from '../style';

export interface LoadingProps {
  loading?: ChatItemProps['loading'];
  placement?: ChatItemProps['placement'];
}

const Loading = memo<LoadingProps>(({ loading, placement }) => {
  const { styles } = useStyles({ placement });

  if (!loading) return null;

  return (
    <div className={styles.loading}>
      <Icon icon={Loader2} size={{ fontSize: 12, strokeWidth: 3 }} spin />
    </div>
  );
});

export default Loading;
