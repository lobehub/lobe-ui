import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { ChatItemProps } from '@/ChatItem';

import { useStyles } from '../style';

export interface ActionsProps {
  actions: ChatItemProps['actions'];
  editing?: boolean;
  placement?: ChatItemProps['placement'];
  type?: ChatItemProps['type'];
}

const Actions = memo<ActionsProps>(({ actions, placement, type, editing }) => {
  const { styles } = useStyles({ editing, placement, type });

  return (
    <Flexbox align={'flex-start'} className={styles.actions} role="widget">
      {actions}
    </Flexbox>
  );
});

export default Actions;
