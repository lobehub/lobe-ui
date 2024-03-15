import { FC } from 'react';
import { type FlexboxProps } from 'react-layout-kit';

import { useStyles } from './style';

export interface TypographyProps extends FlexboxProps {
  fontSize?: number;
  headerMultiple?: number;
}

export const Typography: FC<TypographyProps> = ({
  children,
  className,
  fontSize = 16,
  headerMultiple = 1,
  ...rest
}) => {
  const { cx, styles } = useStyles({ fontSize, headerMultiple: headerMultiple });

  return (
    <div className={cx(styles.markdown, className)} {...rest}>
      {children}
    </div>
  );
};
