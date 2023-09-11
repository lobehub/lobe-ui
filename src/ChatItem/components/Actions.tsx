import { memo } from 'react';

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
    <div className={styles.actions} role="chat-item-actions">
      {actions}
    </div>
  );
});

export default Actions;
