'use client';

import * as stylex from '@stylexjs/stylex';
import { type Key, memo, type MouseEvent, type NamedExoticComponent, useState } from 'react';

import { styleProps } from '@/styles/stylex/props';

import ListRow, { type ListRowXstyle } from './ListRow';
import { styles } from './style';
import type { ListDividerType, ListItem, ListItemType, ListProps } from './type';

const isDivider = (item: ListItem): item is ListDividerType => item.type === 'divider';

const variantStyles = {
  borderless: undefined,
  filled: styles.filled,
  outlined: styles.outlined,
};

export const ListImpl = memo<ListProps & { itemXstyle?: ListRowXstyle }>(
  ({
    activeKey,
    className,
    classNames,
    compact = false,
    defaultActiveKey,
    items,
    onActiveChange,
    onClick,
    ref,
    selectable = false,
    styles: customStyles,
    variant = 'borderless',
    itemXstyle,
    ...rest
  }) => {
    const [innerKey, setInnerKey] = useState<Key | undefined>(defaultActiveKey);
    const currentKey = activeKey === undefined ? innerKey : activeKey;

    const handleSelect = (item: ListItemType, domEvent: MouseEvent<HTMLElement>) => {
      const info = { domEvent, item, key: item.key };
      item.onClick?.(info);
      onClick?.(info);

      if (!selectable || item.key === currentKey) return;
      if (activeKey === undefined) setInnerKey(item.key);
      onActiveChange?.(item.key);
    };

    return (
      <ul
        className={styleProps([styles.root, variantStyles[variant]], className).className}
        ref={ref}
        role="list"
        {...rest}
      >
        {items.map((item, index) =>
          isDivider(item) ? (
            <li
              key={item.key ?? `divider-${index}`}
              role="separator"
              {...stylex.props(styles.divider)}
            />
          ) : (
            <ListRow
              active={currentKey !== undefined && currentKey !== null && item.key === currentKey}
              classNames={classNames}
              compact={compact}
              item={item}
              key={item.key}
              styles={customStyles}
              xstyle={itemXstyle}
              onSelect={handleSelect}
            />
          ),
        )}
      </ul>
    );
  },
);

ListImpl.displayName = 'List';

const List = ListImpl as NamedExoticComponent<ListProps>;

export default List;
