import { FormItemProps as AntdFormItemProps, Form } from 'antd';
import { memo } from 'react';

import FormDivider from './FormDivider';
import FormTitle, { type FormTitleProps } from './FormTitle';
import { useStyles } from './style';

const { Item } = Form;

export interface FormItemProps extends AntdFormItemProps {
  avatar?: FormTitleProps['avatar'];
  desc?: FormTitleProps['desc'];
  divider?: boolean;
  hidden?: boolean;
  minWidth?: string | number;
  tag?: FormTitleProps['tag'];
}

const FormItem = memo<FormItemProps>(
  ({ desc, tag, minWidth, avatar, className, label, children, divider, ...rest }) => {
    const { cx, styles } = useStyles(minWidth);
    return (
      <>
        {divider && <FormDivider />}
        <Item
          className={cx(styles.item, !divider && styles.itemNoDivider, className)}
          label={<FormTitle avatar={avatar} desc={desc} tag={tag} title={label as any} />}
          {...rest}
        >
          {children}
        </Item>
      </>
    );
  },
);

export default FormItem;
