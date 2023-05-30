import { Button } from 'antd';
import { FC, ReactNode } from 'react';

import { useStyles } from './style';

interface HeroButtonProps {
  children: ReactNode;
}
const HeroButton: FC<HeroButtonProps> = ({ children }) => {
  const { styles } = useStyles();
  return (
    <Button className={styles.button} shape={'round'} size={'large'} type={'primary'}>
      {children}
    </Button>
  );
};

export default HeroButton;
