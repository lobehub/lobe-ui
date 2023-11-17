import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import Alert from '@/Alert';
import { ChatItemProps } from '@/ChatItem';

import { useStyles } from '../style';

export interface ErrorContentProps {
  error?: ChatItemProps['error'];
  message?: ChatItemProps['errorMessage'];
  placement?: ChatItemProps['placement'];
}

const ErrorContent = memo<ErrorContentProps>(({ message, error, placement }) => {
  const { styles } = useStyles({ placement });

  return (
    <Flexbox className={styles.errorContent} gap={8}>
      <Alert closable={false} showIcon type={'error'} {...error} />
      {message}
    </Flexbox>
  );
});

export default ErrorContent;
