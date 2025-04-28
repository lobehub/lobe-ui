import type { CSSProperties, ReactNode, Ref } from 'react';
import type { FlexboxProps } from 'react-layout-kit';

export interface ListItemProps extends Omit<FlexboxProps, 'title'> {
  actions?: ReactNode;
  active?: boolean;
  addon?: ReactNode;
  avatar?: ReactNode;
  classNames?: {
    actions?: string;
    container?: string;
    content?: string;
    date?: string;
    desc?: string;
    pin?: string;
    title?: string;
  };
  date?: number;
  description?: ReactNode;
  key: string;
  loading?: boolean;
  onHoverChange?: (hover: boolean) => void;
  pin?: boolean;
  ref?: Ref<HTMLDivElement>;
  showAction?: boolean;
  styles?: {
    actions?: CSSProperties;
    container?: CSSProperties;
    content?: CSSProperties;
    date?: CSSProperties;
    desc?: CSSProperties;
    pin?: CSSProperties;
    title?: CSSProperties;
  };
  title: ReactNode;
}

export interface ListProps extends Omit<FlexboxProps, 'onClick'> {
  activeKey?: string;
  classNames?: {
    item?: string;
  } & ListItemProps['classNames'];
  items: ListItemProps[];
  onClick?: (props: { item: ListItemProps; key: ListItemProps['key'] }) => void;
  ref?: Ref<HTMLDivElement>;
  styles?: {
    item?: CSSProperties;
  } & ListItemProps['styles'];
}
