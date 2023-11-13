import { Form as AntForm, FormProps as AntFormProps, type FormInstance } from 'antd';
import { type ReactNode, RefAttributes, forwardRef } from 'react';

import FormFooter from './components/FormFooter';
import FormGroup, { type FormGroupProps } from './components/FormGroup';
import FormItem, { type FormItemProps } from './components/FormItem';
import { useStyles } from './style';

export interface ItemGroup {
  children: FormItemProps[];
  extra?: FormGroupProps['extra'];
  icon?: FormGroupProps['icon'];
  title: FormGroupProps['title'];
}

export interface FormProps extends AntFormProps {
  children?: ReactNode;
  footer?: ReactNode;
  itemMinWidth?: FormItemProps['minWidth'];
  items?: ItemGroup[];
}

const FormParent = forwardRef<FormInstance, FormProps>(
  ({ className, itemMinWidth, footer, form, items, children, ...rest }, ref) => {
    const { cx, styles } = useStyles();
    return (
      <AntForm
        className={cx(styles.form, className)}
        colon={false}
        form={form}
        layout="horizontal"
        ref={ref}
        {...rest}
      >
        {items?.map((group, groupIndex) => (
          <FormGroup extra={group?.extra} icon={group?.icon} key={groupIndex} title={group.title}>
            {group.children
              .filter((item) => !item.hidden)
              .map((item, itemIndex) => {
                return (
                  <FormItem
                    divider={itemIndex !== 0}
                    key={itemIndex}
                    minWidth={itemMinWidth}
                    {...item}
                  />
                );
              })}
          </FormGroup>
        ))}
        {children}
        {footer && <FormFooter>{footer}</FormFooter>}
      </AntForm>
    );
  },
);

export interface IForm {
  (props: FormProps & RefAttributes<FormInstance>): ReactNode;
  Group: typeof FormGroup;
  Item: typeof FormItem;
}

const Form = FormParent as unknown as IForm;

Form.Item = FormItem;
Form.Group = FormGroup;

export default Form;
