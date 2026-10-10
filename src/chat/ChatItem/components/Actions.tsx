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
      flex={'none'}
      justify={placement === 'left' ? 'flex-end' : 'flex-start'}
      ref={ref}
      role="menubar"
      className={
        styleProps(
          variant !== 'bubble' && placement === 'left' ? styles.actionsTop : styles.actionsBottom,
          editing ? 'lobe-chat-item-actions-editing' : undefined,
        ).className
      }
    >
      {actions}
    </Flexbox>
  );
};

export default Actions;
