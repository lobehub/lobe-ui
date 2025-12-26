import { cx } from 'antd-style';
import { type FC, type Ref, useMemo } from 'react';

import { Flexbox } from '@/Flex';
import { ChatItemProps } from '@/chat/ChatItem';

import { styles } from '../style';

export interface ActionsProps {
  actions: ChatItemProps['actions'];
  editing?: boolean;
  placement?: ChatItemProps['placement'];
  ref?: Ref<HTMLDivElement>;
  variant?: ChatItemProps['variant'];
}

const Actions: FC<ActionsProps> = ({
  actions,
  placement = 'left',
  variant = 'bubble',
  editing,
  ref,
}) => {
  const actionsClassName = useMemo(() => {
    if (variant === 'bubble') {
      return placement === 'left' ? styles.actionsBubbleLeft : styles.actionsBubbleRight;
    }
    return placement === 'left' ? styles.actionsDocsLeft : styles.actionsDocsRight;
  }, [placement, variant]);

  return (
    <Flexbox
      align={'flex-start'}
      className={cx(actionsClassName, editing && styles.actionsEditing)}
      ref={ref}
      role="menubar"
    >
      {actions}
    </Flexbox>
  );
};

export default Actions;
