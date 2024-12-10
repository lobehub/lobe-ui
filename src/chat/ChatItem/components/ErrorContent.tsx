import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import Alert from '@/Alert';
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
