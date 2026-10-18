import type { FC } from 'react';

import Alert from '@/Alert';
import { type ChatItemProps } from '@/chat/ChatItem';
import { Flexbox } from '@/Flex';
import { styleProps } from '@/styles/stylex/props';

import { chatChatItemClasses } from '../stable';
import { styles } from '../style';

export interface ErrorContentProps {
  error?: ChatItemProps['error'];
  message?: ChatItemProps['errorMessage'];
  placement?: ChatItemProps['placement'];
}

const ErrorContent: FC<ErrorContentProps> = ({ message, error }) => {
  return (
    <Flexbox width={'100%'} {...styleProps(styles.errorContainer, chatChatItemClasses('error'))}>
      <Alert showIcon closable={false} extra={message} type={'error'} {...error} />
    </Flexbox>
  );
};

export default ErrorContent;
