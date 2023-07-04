import { FormItemProps as AntdFormItemProps, Form } from 'antd';
import { memo } from 'react';

import FormDivider from './FormDivider';
import FormTitle from './FormTitle';
import { useStyles } from './style';

const { Item } = Form;

export interface FormItemProps extends AntdFormItemProps {
  desc?: string;
  divider?: boolean;
}

const FormItem = memo<FormItemProps>(({ desc, className, label, children, divider, ...props }) => {
  const { cx, styles } = useStyles();
  return (
    <>
      {divider && <FormDivider />}
      <Item
        className={cx(styles.item, className)}
        label={desc ? <FormTitle desc={desc} title={String(label)} /> : label}
        {...props}
      >
        {children}
      </Item>
    </>
  );
});

export default FormItem;
