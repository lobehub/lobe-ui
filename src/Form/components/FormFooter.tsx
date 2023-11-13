import { memo } from 'react';

import { DivProps } from '@/types';

import { useStyles } from './style';

export type FormFooterProps = DivProps;

const FormFooter = memo<FormFooterProps>(({ className, children, ...rest }) => {
  const { cx, styles } = useStyles();
  return (
    <div className={cx(styles.footer, className)} {...rest}>
      {children}
    </div>
  );
});

export default FormFooter;
