import { Form as AntForm, FormProps as AntFormProps, type FormInstance } from 'antd';
import { type ReactNode, RefAttributes, forwardRef } from 'react';

import FormFooter from './components/FormFooter';
import FormGroup, { type FormGroupProps, FormVariant, ItemsType } from './components/FormGroup';
import FormItem, { type FormItemProps } from './components/FormItem';
import { useStyles } from './style';

export interface ItemGroup {
  children: FormItemProps[] | ReactNode;
  defaultActive?: boolean;
  extra?: FormGroupProps['extra'];
  icon?: FormGroupProps['icon'];
  title: FormGroupProps['title'];
}

export interface FormProps extends AntFormProps {
  children?: ReactNode;
  footer?: ReactNode;
  itemMinWidth?: FormItemProps['minWidth'];
  items?: ItemGroup[] | FormItemProps[];
  itemsType?: ItemsType;
  variant?: FormVariant;
}

const FormParent = forwardRef<FormInstance, FormProps>(
  (
    {
      className,
      itemMinWidth,
      footer,
      form,
      items = [],
      children,
      itemsType = 'group',
      variant = 'default',
      ...rest
    },
    ref,
  ) => {
    const { cx, styles } = useStyles();

    const mapFlat = (item: FormItemProps, itemIndex: number) => (
      <FormItem divider={itemIndex !== 0} key={itemIndex} minWidth={itemMinWidth} {...item} />
    );
    const mapTree = (group: ItemGroup, groupIndex: number) => (
      <FormGroup
        defaultActive={group?.defaultActive}
        extra={group?.extra}
        icon={group?.icon}
        key={groupIndex}
        title={group.title}
        variant={variant}
      >
        {Array.isArray(group.children)
          ? group.children.filter((item) => !item.hidden).map((item, i) => mapFlat(item, i))
          : group.children}
      </FormGroup>
    );

    return (
      <AntForm
        className={cx(styles.form, className)}
        colon={false}
        form={form}
        layout="horizontal"
        ref={ref}
        {...rest}
      >
        {items?.length > 0 ? (
          itemsType === 'group' ? (
            (items as ItemGroup[])?.map((item, i) => mapTree(item, i))
          ) : (
            <FormGroup itemsType={'flat'} variant={variant}>
              {(items as FormItemProps[])
                ?.filter((item) => !item.hidden)
                .map((item, i) => mapFlat(item, i))}
            </FormGroup>
          )
        ) : null}
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
