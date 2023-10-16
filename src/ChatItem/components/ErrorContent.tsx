import { Alert } from 'antd';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

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
    <Flexbox gap={8}>
      <Alert className={styles.alert} showIcon type={'error'} {...error} />
      {message}
    </Flexbox>
  );
});

export default ErrorContent;
