import { Button, ButtonProps } from 'antd';
import { memo } from 'react';

import { useStyles } from './style';

export interface GradientButtonProps extends ButtonProps {
  /**
   * @description Whether the button should spin or not
   * @default false
   */
  spin?: boolean;
}

const GradientButton = memo<GradientButtonProps>(({ children, className, ...props }) => {
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
