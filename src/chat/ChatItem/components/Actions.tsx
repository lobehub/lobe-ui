import { type FC, type Ref } from 'react';

import { Flexbox } from '@/Flex';
import { ChatItemProps } from '@/chat/ChatItem';

import { useStyles } from '../style';

export interface ActionsProps {
  actions: ChatItemProps['actions'];
  editing?: boolean;
  placement?: ChatItemProps['placement'];
  ref?: Ref<HTMLDivElement>;
  variant?: ChatItemProps['variant'];
}

const Actions: FC<ActionsProps> = ({ actions, placement, variant, editing, ref }) => {
  const { styles } = useStyles({ editing, placement, variant });

  return (
    <Flexbox align={'flex-start'} className={styles.actions} ref={ref} role="menubar">
      {actions}
    </Flexbox>
  );
};

export default Actions;
