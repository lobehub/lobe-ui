'use client';

import { cx } from 'antd-style';
import { type Key, memo, type MouseEvent, useState } from 'react';

import ListRow from './ListRow';
import { styles } from './style';
import type { ListDividerType, ListItem, ListItemType, ListProps } from './type';

const isDivider = (item: ListItem): item is ListDividerType => item.type === 'divider';

const variantClass = {
  borderless: undefined,
  filled: styles.filled,
  outlined: styles.outlined,
};

const List = memo<ListProps>(
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
        className={cx(styles.root, variantClass[variant], compact && styles.compact, className)}
        ref={ref}
        role="list"
        {...rest}
      >
        {items.map((item, index) =>
          isDivider(item) ? (
            <li className={styles.divider} key={item.key ?? `divider-${index}`} role="separator" />
          ) : (
            <ListRow
              active={currentKey !== undefined && currentKey !== null && item.key === currentKey}
              classNames={classNames}
              item={item}
              key={item.key}
              styles={customStyles}
              onSelect={handleSelect}
            />
          ),
        )}
      </ul>
    );
  },
);

List.displayName = 'List';

export default List;
