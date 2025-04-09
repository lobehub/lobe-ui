import { type Ref, memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { ChatItemProps } from '@/chat/ChatItem';

import { useStyles } from '../style';

export interface ActionsProps {
  actions: ChatItemProps['actions'];
  editing?: boolean;
  placement?: ChatItemProps['placement'];
  ref?: Ref<HTMLDivElement>;
  type?: ChatItemProps['type'];
}

const Actions = memo<ActionsProps>(({ actions, placement, type, editing, ref }) => {
  const { styles } = useStyles({ editing, placement, type });

  return (
    <Flexbox align={'flex-start'} className={styles.actions} ref={ref} role="menubar">
      {actions}
    </Flexbox>
  );
});

export default Actions;
