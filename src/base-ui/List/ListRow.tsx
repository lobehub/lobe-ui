'use client';

import { cx } from 'antd-style';
import { memo, type MouseEvent } from 'react';

import A from '@/A';
import Icon from '@/Icon';

import { styles } from './style';
import type { ListItemType, ListProps } from './type';

interface ListRowProps {
  active: boolean;
  classNames?: ListProps['classNames'];
  item: ListItemType;
  onSelect: (item: ListItemType, event: MouseEvent<HTMLElement>) => void;
  styles?: ListProps['styles'];
}

const ListRow = memo<ListRowProps>(
  ({ active, classNames, item, onSelect, styles: customStyles }) => {
    const { actions, avatar, danger, description, disabled, extra, href, icon, label, showAction } =
      item;

    const handleClick = (event: MouseEvent<HTMLElement>) => {
      if (disabled) {
        event.preventDefault();
        return;
      }
      onSelect(item, event);
    };

    const rowClassName = cx(
      styles.row,
      active && styles.active,
      danger && styles.danger,
      disabled && styles.disabled,
      classNames?.item,
      item.className,
    );
    const rowStyle = { ...customStyles?.item, ...item.style };

    const content = (
      <>
        {avatar ?? (icon ? <Icon icon={icon} size={16} /> : null)}
        <span className={styles.body}>
          <span className={cx(styles.label, classNames?.label)} style={customStyles?.label}>
            {label}
          </span>
          {description != null && (
            <span
              className={cx(styles.description, classNames?.description)}
              style={customStyles?.description}
            >
              {description}
            </span>
          )}
        </span>
        {extra != null && (
          <span className={cx(styles.extra, classNames?.extra)} style={customStyles?.extra}>
            {extra}
          </span>
        )}
      </>
    );

    return (
      <li className={cx(styles.item, showAction && styles.showAction)}>
        {href && !disabled ? (
          <A
            aria-current={active ? 'page' : undefined}
            className={rowClassName}
            href={href}
            style={rowStyle}
            onClick={handleClick}
          >
            {content}
          </A>
        ) : (
          <button
            aria-current={active ? 'true' : undefined}
            aria-disabled={disabled || undefined}
            className={rowClassName}
            style={rowStyle}
            type="button"
            onClick={handleClick}
          >
            {content}
          </button>
        )}
        {actions != null && (
          <span className={cx(styles.actions, classNames?.actions)} style={customStyles?.actions}>
            {actions}
          </span>
        )}
      </li>
    );
  },
);

ListRow.displayName = 'ListRow';

export default ListRow;
