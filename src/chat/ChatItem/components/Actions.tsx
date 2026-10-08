import { type FC, type Ref } from 'react';

import { type ChatItemProps } from '@/chat/ChatItem';
import { Flexbox } from '@/Flex';
import { styleProps } from '@/styles/stylex/props';

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
  return (
    <Flexbox
      align={'flex-start'}
      ref={ref}
      role="menubar"
      className={
        styleProps(
          [
            styles.actions,
            variant !== 'bubble' && placement === 'left' ? styles.actionsTop : styles.actionsBottom,
            placement === 'left' ? styles.actionsEnd : styles.actionsStart,
          ],
          editing ? 'lobe-chat-item-actions-editing' : undefined,
        ).className
      }
    >
      {actions}
    </Flexbox>
  );
};

export default Actions;
