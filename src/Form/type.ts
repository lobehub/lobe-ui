import type { FormProps as AntFormProps } from 'antd';
import type { ReactNode } from 'react';

import type { FormGroupItem } from './components/FormGroup';
import type { FormItemProps } from './components/FormItem';

export type FormVariant = 'filled' | 'outlined' | 'borderless';
export type ItemsType = 'group' | 'flat';

export interface FormProps extends Omit<AntFormProps, 'variant'> {
  activeKey?: (string | number)[];
  children?: ReactNode;
  collapsible?: boolean;
  defaultActiveKey?: (string | number)[];
  footer?: ReactNode;
  gap?: number | string;
  itemMinWidth?: FormItemProps['minWidth'];
  items?: FormGroupItem[] | FormItemProps[];
  itemsType?: ItemsType;
  onCollapse?: (key: (string | number)[]) => void;
  variant?: FormVariant;
}
