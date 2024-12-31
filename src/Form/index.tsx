'use client';

import { Form as AntForm, FormProps as AntFormProps, type FormInstance } from 'antd';
import { isUndefined } from 'lodash-es';
import { CSSProperties, type ReactNode, RefAttributes, forwardRef } from 'react';

import FormFlatGroup from './components/FormFlatGroup';
import FormFooter from './components/FormFooter';
import FormGroup, {
  type FormVariant,
  type ItemGroup,
  type ItemsType,
} from './components/FormGroup';
import FormItem, { type FormItemProps } from './components/FormItem';
import { useStyles } from './style';

export interface FormProps extends Omit<AntFormProps, 'variant'> {
  activeKey?: (string | number)[];
  children?: ReactNode;
  classNames?: {
    footer?: string;
  };
  collapsible?: boolean;
  defaultActiveKey?: (string | number)[];
  footer?: ReactNode;
  gap?: number | string;
  itemMinWidth?: FormItemProps['minWidth'];
  items?: ItemGroup[] | FormItemProps[];
  itemsType?: ItemsType;
  onCollapse?: (key: (string | number)[]) => void;
  styles?: {
    footer?: CSSProperties;
  };
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
      gap,
      style,
      collapsible,
      classNames = {},
      styles = {},
      defaultActiveKey,
      activeKey,
      onCollapse,
      ...rest
    },
    ref,
  ) => {
    const { cx, styles: s } = useStyles();

    const mapFlat = (item: FormItemProps, itemIndex: number) => (
      <FormItem divider={itemIndex !== 0} key={itemIndex} minWidth={itemMinWidth} {...item} />
    );
    const mapTree = (group: ItemGroup, groupIndex: number) => {
      const key = group?.key || groupIndex;
      return (
        <FormGroup
          active={activeKey && group?.key ? activeKey.includes(key) : undefined}
          collapsible={isUndefined(group.collapsible) ? collapsible : group.collapsible}
          defaultActive={
            defaultActiveKey && group?.key ? defaultActiveKey.includes(key) : group?.defaultActive
          }
          extra={group?.extra}
          icon={group?.icon}
          key={key}
          onCollapse={(active) => {
            let keys: (string | number)[] = activeKey || defaultActiveKey || [];
            keys = keys.filter((k) => k !== key);
            onCollapse?.(active ? [...keys, key] : keys);
          }}
          title={group.title}
          variant={group?.variant || variant}
        >
          {Array.isArray(group.children)
            ? group.children.filter((item) => !item.hidden).map((item, i) => mapFlat(item, i))
            : group.children}
        </FormGroup>
      );
    };

    return (
      <AntForm
        className={cx(s.form, variant === 'pure' && s.pure, s.mobile, className)}
        colon={false}
        form={form}
        layout={'horizontal'}
        ref={ref}
        style={{
          gap,
          ...style,
        }}
        {...rest}
      >
        {items && items?.length > 0 ? (
          itemsType === 'group' ? (
            (items as ItemGroup[])?.map((item, i) => mapTree(item, i))
          ) : (
            <FormFlatGroup variant={variant}>
              {(items as FormItemProps[])
                ?.filter((item) => !item.hidden)
                .map((item, i) => mapFlat(item, i))}
            </FormFlatGroup>
          )
        ) : undefined}
        {children}
        {footer && (
          <FormFooter className={classNames?.footer} style={styles?.footer}>
            {footer}
          </FormFooter>
        )}
      </AntForm>
    );
  },
);

export type { FormInstance } from 'antd';

export interface IForm {
  (props: FormProps & RefAttributes<FormInstance>): ReactNode;
  Group: typeof FormGroup;
  Item: typeof FormItem;
  Provider: typeof AntForm.Provider;
  useForm: typeof AntForm.useForm;
}

const Form = FormParent as unknown as IForm;

Form.Item = FormItem;
Form.Group = FormGroup;
Form.useForm = AntForm.useForm;
Form.Provider = AntForm.Provider;

export default Form;
