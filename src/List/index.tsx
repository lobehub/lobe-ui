'use client';

import { cx } from 'antd-style';
import { CSSProperties, type ReactNode, RefAttributes, forwardRef } from 'react';
import { Flexbox, FlexboxProps } from 'react-layout-kit';

import ListItem, { type ListItemProps } from './ListItem';

export interface ListProps extends Omit<FlexboxProps, 'onClick'> {
  activeKey?: string;
  classNames?: {
    item?: string;
  } & ListItemProps['classNames'];
  items: ListItemProps[];
  onClick?: (props: { item: ListItemProps; key: ListItemProps['key'] }) => void;
  styles?: {
    item?: CSSProperties;
  } & ListItemProps['styles'];
}

const ListParent = forwardRef<HTMLDivElement, ListProps>(
  ({ activeKey, classNames, styles, onClick, items, ...rest }, ref) => {
    return (
      <Flexbox gap={4} padding={4} {...rest}>
        {items.map((item) => {
          const {
            key,
            onClick: itemOnClick,
            className: itemClassName,
            style: itemStyle,
            ...itemRest
          } = item;
          const { item: customItemClassName, ...restClassName } = classNames || {};
          const { item: customItemStyle, ...restStyles } = styles || {};
          return (
            <ListItem
              active={item.key === activeKey}
              className={cx(customItemClassName, itemClassName)}
              classNames={restClassName}
              key={key}
              onClick={(e) => {
                onClick?.({
                  item,
                  key,
                });
                itemOnClick?.(e);
              }}
              ref={ref}
              style={{ ...customItemStyle, ...itemStyle }}
              styles={restStyles}
              {...itemRest}
            />
          );
        })}
      </Flexbox>
    );
  },
);

ListParent.displayName = 'List';

export interface IList {
  (props: ListProps & RefAttributes<HTMLDivElement>): ReactNode;
  Item: typeof ListItem;
}

const List = ListParent as unknown as IList;

List.Item = ListItem;

export default List;
