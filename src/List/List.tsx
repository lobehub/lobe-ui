'use client';

import clsx from 'clsx';
import { type Key, memo, type MouseEvent, type NamedExoticComponent, useState } from 'react';

import { styleProps } from '@/styles/stylex/props';
import { toDataAttributes } from '@/utils/bem';

import ListRow, { type ListRowXstyle } from './ListRow';
import { listClasses } from './stable';
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
        ref={ref}
        role="list"
        className={
          styleProps([styles.root, variantStyles[variant]], clsx(listClasses(), className))
            .className
        }
        {...toDataAttributes({ compact, selectable, variant })}
        {...rest}
      >
        {items.map((item, index) =>
          isDivider(item) ? (
            <li
              key={item.key ?? `divider-${index}`}
              role="separator"
              {...styleProps(styles.divider, listClasses('divider'))}
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
