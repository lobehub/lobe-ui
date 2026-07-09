import type { Field } from '@base-ui/react/field';
import type { Form as BaseForm } from '@base-ui/react/form';
import type { ComponentProps, CSSProperties, ReactNode, Ref } from 'react';

import type { ButtonProps } from '@/base-ui/Button';
import type { FlexboxProps } from '@/Flex';
import type { IconProps } from '@/Icon';
import type { TagProps } from '@/Tag';
import type { DivProps } from '@/types';

export type FormVariant = 'filled' | 'outlined' | 'borderless';
export type FormLayout = 'horizontal' | 'vertical';
export type ItemsType = 'group' | 'flat';

export type FormValues = Record<string, any>;

type BaseFormProps = Omit<ComponentProps<typeof BaseForm>, 'render' | 'className' | 'style'>;

export interface FormProps extends BaseFormProps {
  activeKey?: (string | number)[];
  className?: string;
  classNames?: {
    group?: string;
    item?: string;
  };
  collapsible?: boolean;
  defaultActiveKey?: (string | number)[];
  footer?: ReactNode;
  gap?: number | string;
  /**
   * Initial values distributed to fields as `defaultValue` by name.
   * Also the baseline for unsaved-changes detection and native reset.
   */
  initialValues?: FormValues;
  itemMinWidth?: FormFieldProps['minWidth'];
  items?: FormGroupItemType[] | FormFieldProps[];
  itemsType?: ItemsType;
  layout?: FormLayout;
  onCollapse?: (key: (string | number)[]) => void;
  /**
   * Called with collected field values on submit. Async callbacks drive submit loading state.
   */
  onFinish?: (
    values: FormValues,
    eventDetails: Parameters<NonNullable<BaseFormProps['onFormSubmit']>>[1],
  ) => void | Promise<void>;
  ref?: Ref<HTMLFormElement>;
  style?: CSSProperties;
  styles?: {
    group?: CSSProperties;
    item?: CSSProperties;
  };
  variant?: FormVariant;
}

export interface FormFieldProps extends Omit<
  ComponentProps<typeof Field.Root>,
  'render' | 'children' | 'className' | 'style'
> {
  avatar?: ReactNode;
  children?: ReactNode;
  className?: string;
  desc?: ReactNode;
  divider?: boolean;
  hidden?: boolean;
  label?: ReactNode;
  layout?: FormLayout;
  minWidth?: string | number;
  required?: boolean;
  style?: CSSProperties;
  tag?: string;
  variant?: FormVariant;
}

export interface FormGroupItemType {
  children: FormFieldProps[] | ReactNode;
  collapsible?: boolean;
  defaultActive?: boolean;
  desc?: ReactNode;
  extra?: ReactNode;
  icon?: IconProps['icon'];
  key?: string;
  title: ReactNode;
  variant?: FormVariant;
}

export interface FormGroupProps extends Omit<DivProps, 'title'> {
  active?: boolean;
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

export interface FormFlatGroupProps extends FlexboxProps {
  variant?: FormVariant;
}

export interface FormDividerProps extends DivProps {
  visible?: boolean;
}

export type FormFooterProps = FlexboxProps;

export interface FormSubmitFooterProps extends Omit<FlexboxProps, 'onReset'> {
  buttonProps?: Omit<ButtonProps, 'children'>;
  enableReset?: boolean;
  enableUnsavedWarning?: boolean;
  float?: boolean;
  onReset?: () => void;
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

export interface FormContextValue {
  hasUnsavedChanges: boolean;
  initialValues?: FormValues;
  itemMinWidth?: FormFieldProps['minWidth'];
  layout: FormLayout;
  requestReset: () => void;
  submitLoading: boolean;
  variant: FormVariant;
}
