import { Alert } from 'antd';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { ChatItemProps } from '@/ChatItem';

import { useStyles } from '../style';

export interface ErrorContentProps {
  ErrorMessage?: ChatItemProps['ErrorMessage'];
  error?: ChatItemProps['error'];
  placement?: ChatItemProps['placement'];
}

const ErrorContent = memo<ErrorContentProps>(({ ErrorMessage, error, placement }) => {
  const { styles } = useStyles({ placement });

  return (
    <Flexbox gap={8}>
      <Alert className={styles.alert} showIcon type={'error'} {...error} />
      {ErrorMessage}
    </Flexbox>
  );
});

export default ErrorContent;
