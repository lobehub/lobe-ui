import { memo } from 'react';

import Alert from '@/Alert';
import { Flexbox } from '@/Flex';
import { ChatItemProps } from '@/chat/ChatItem';

import { useStyles } from '../style';

export interface ErrorContentProps {
  error?: ChatItemProps['error'];
  message?: ChatItemProps['errorMessage'];
  placement?: ChatItemProps['placement'];
}

const ErrorContent = memo<ErrorContentProps>(({ message, error, placement }) => {
  const { styles } = useStyles({ placement });

  return (
    <Flexbox className={styles.errorContainer}>
      <Alert closable={false} extra={message} showIcon type={'error'} {...error} />
    </Flexbox>
  );
});

export default ErrorContent;
