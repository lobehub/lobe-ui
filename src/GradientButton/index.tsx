import { Button, type ButtonProps } from 'antd';
import { memo } from 'react';

import { useStyles } from './style';

export type GradientButtonProps = ButtonProps;

const GradientButton = memo<ButtonProps>(({ children, className, ...props }) => {
  const { styles, cx } = useStyles();

  return (
    <Button className={cx(styles.button, className)} {...props}>
      <div className={styles.glow} />
      <div className={styles.bg} />
      {children}
    </Button>
  );
});

export default GradientButton;
