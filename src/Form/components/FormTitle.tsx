import { memo } from 'react';

import { DivProps } from '@/types';

import { useStyles } from './style';

export interface FormTitleProps extends DivProps {
  desc: string;
  title: string;
}

const FormTitle = memo<FormTitleProps>(({ className, title, desc }) => {
  const { cx, styles } = useStyles();
  return (
    <div className={cx(styles.formTitle, className)}>
      <div>{title}</div>
      <small>{desc}</small>
    </div>
  );
});

export default FormTitle;
