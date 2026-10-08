import * as stylex from '@stylexjs/stylex';
import type { FC } from 'react';

import Alert from '@/Alert';
import { type ChatItemProps } from '@/chat/ChatItem';
import { Flexbox } from '@/Flex';

import { styles } from '../style';

export interface ErrorContentProps {
  error?: ChatItemProps['error'];
  message?: ChatItemProps['errorMessage'];
  placement?: ChatItemProps['placement'];
}

const ErrorContent: FC<ErrorContentProps> = ({ message, error }) => {
  return (
    <Flexbox width={'100%'} {...stylex.props(styles.errorContainer)}>
      <Alert showIcon closable={false} extra={message} type={'error'} {...error} />
    </Flexbox>
  );
};

export default ErrorContent;
