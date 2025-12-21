import type { FormProps as AntFormProps, DividerProps, FormInstance } from 'antd';
import { FormItemProps as AntdFormItemProps } from 'antd/es/form/FormItem';
import { CSSProperties, ReactNode, Ref } from 'react';

import type { ButtonProps } from '@/Button';
import type { CollapseProps } from '@/Collapse';
import { FlexboxProps } from '@/Flex';
import type { IconProps } from '@/Icon';
import type { TagProps } from '@/Tag';
import type { DivProps } from '@/types';

export type FormVariant = 'filled' | 'outlined' | 'borderless';
export type ItemsType = 'group' | 'flat';

export interface FormProps extends Omit<AntFormProps, 'variant'> {
  activeKey?: (string | number)[];
  children?: ReactNode;
  classNames?: FormGroupProps['classNames'] & {
    group?: string;
    item?: string;
  };
  collapsible?: boolean;
  defaultActiveKey?: (string | number)[];
  footer?: ReactNode;
  gap?: number | string;
  itemMinWidth?: FormItemProps['minWidth'];
  itemVariant?: AntFormProps['variant'];
  items?: FormGroupItemType[] | FormItemProps[];
  itemsType?: ItemsType;
  onCollapse?: (key: (string | number)[]) => void;
  ref?: Ref<FormInstance>;
  styles?: FormGroupProps['styles'] & {
    group?: CSSProperties;
    item?: CSSProperties;
  };
  variant?: FormVariant;
}

export interface FormDividerProps extends DividerProps {
  visible?: boolean;
}

export interface FormFlatGroupProps extends FlexboxProps {
  variant?: FormVariant;
}

export type FormFooterProps = DivProps;

export type { FormInstance } from 'antd';

export interface FormGroupItemType {
  children: FormItemProps[] | ReactNode;
  collapsible?: boolean;
  defaultActive?: boolean;
  desc?: ReactNode;
  extra?: ReactNode;
  icon?: IconProps['icon'];
  key?: string;
  title: ReactNode;
  variant?: FormVariant;
}

export interface FormGroupProps extends Omit<
  CollapseProps,
  'collapsible' | 'items' | 'defaultActiveKey' | 'activeKey'
> {
  active?: boolean;
  children: ReactNode;
  collapsible?: boolean;
  defaultActive?: boolean;
  desc?: ReactNode;
  extra?: ReactNode;
  icon?: IconProps['icon'];
  keyValue?: string | number;
  onCollapse?: (active: boolean) => void;
  title?: ReactNode;
  variant?: FormVariant;
}

export interface FormItemProps extends AntdFormItemProps {
  avatar?: FormTitleProps['avatar'];
  desc?: FormTitleProps['desc'];
  divider?: boolean;
  hidden?: boolean;
  minWidth?: string | number;
  tag?: FormTitleProps['tag'];
  variant?: FormVariant;
}

export interface FormSubmitFooterProps extends Omit<FlexboxProps, 'onReset'> {
  buttonProps?: Omit<ButtonProps, 'children'>;
  children?: ReactNode;
  enableReset?: boolean;
  enableUnsavedWarning?: boolean;
  float?: boolean;
  onReset?: (value: any, preValue: any) => void;
  resetButtonProps?: Omit<ButtonProps, 'children'>;
  saveButtonProps?: Omit<ButtonProps, 'children'>;
  texts?: {
    reset?: string;
    submit?: string;
    unSaved?: string;
    unSavedWarning?: string;
  };
}

export interface FormTitleProps extends Omit<FlexboxProps, 'title'> {
  avatar?: ReactNode;
  classNames?: {
    content?: string;
    desc?: string;
    tag?: string;
    title?: string;
  };
  desc?: ReactNode;
  styles?: {
    content?: CSSProperties;
    desc?: CSSProperties;
    tag?: CSSProperties;
    title?: CSSProperties;
  };
  tag?: string;
  tagProps?: Omit<TagProps, 'children'>;
  title: ReactNode;
}
