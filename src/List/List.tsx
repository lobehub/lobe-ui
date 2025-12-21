'use client';

import { cx } from 'antd-style';
import { memo } from 'react';

import { Flexbox } from '@/Flex';

import ListItem from './ListItem';
import type { ListProps } from './type';

const List = memo<ListProps>(({ ref, activeKey, classNames, styles, onClick, items, ...rest }) => {
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
});

List.displayName = 'List';

export default List;
