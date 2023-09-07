import { Button, type ButtonProps } from 'antd';
import { memo } from 'react';

import { useStyles } from './style';

export interface GradientButtonProps extends ButtonProps {
  glow?: boolean;
}

const GradientButton = memo<GradientButtonProps>(
  ({ glow = true, children, className, size = 'large', ...props }) => {
    const { styles, cx } = useStyles(size);

    return (
      <Button className={cx(styles.button, className)} size={size} {...props}>
        {glow && <div className={styles.glow} />}
        {children}
      </Button>
    );
  },
);

export default GradientButton;
