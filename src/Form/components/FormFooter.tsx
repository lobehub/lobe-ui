import { memo } from 'react';

import { DivProps } from '@/types';

import { useStyles } from './style';

export type FormFooterProps = DivProps;

const FormFooter = memo<FormFooterProps>(({ className, children, ...props }) => {
  const { cx, styles } = useStyles();
  return (
    <div className={cx(styles.footer, className)} {...props}>
      {children}
    </div>
  );
});

export default FormFooter;
