import { type FC } from 'react';

import Alert from '@/Alert';
import { Flexbox } from '@/Flex';
import { ChatItemProps } from '@/chat/ChatItem';

import { styles } from '../style';

export interface ErrorContentProps {
  error?: ChatItemProps['error'];
  message?: ChatItemProps['errorMessage'];
  placement?: ChatItemProps['placement'];
}

const ErrorContent: FC<ErrorContentProps> = ({ message, error }) => {
  return (
    <Flexbox className={styles.errorContainer}>
      <Alert closable={false} extra={message} showIcon type={'error'} {...error} />
    </Flexbox>
  );
};

export default ErrorContent;
