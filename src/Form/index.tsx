import { Form as AntForm, FormProps as AntFormProps } from 'antd';
import { memo } from 'react';

import { useStyles } from './style';

export type FormProps = AntFormProps;

const Form = memo<FormProps>(({ className, ...props }) => {
  const { cx, styles } = useStyles();
  return (
    // @ts-ignore
    <AntForm className={cx(styles.form, className)} colon={false} layout="horizontal" {...props} />
  );
});
export default Form;
