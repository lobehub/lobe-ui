import { memo } from 'react';

import { ChatItemProps } from '@/ChatItem';

import { useStyles } from '../style';

export interface ActionsProps {
  actions: ChatItemProps['actions'];
  placement?: ChatItemProps['placement'];
  type?: ChatItemProps['type'];
}

const Actions = memo<ActionsProps>(({ actions, placement, type }) => {
  const { styles } = useStyles({ placement, type });

  return (
    <div className={styles.actions} role="chat-item-actions">
      {actions}
    </div>
  );
});

export default Actions;
