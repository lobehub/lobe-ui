'use client';

import './style.css';

import clsx from 'clsx';
import { memo, type MouseEvent } from 'react';

import A from '@/A';
import Icon from '@/Icon';
import { focusRing } from '@/styles/stylex/focusRing';
import { styleProps } from '@/styles/stylex/props';
import { toDataAttributes } from '@/utils/bem';

import { listItemMarker } from './marker.stylex';
import { listClasses } from './stable';
import { styles } from './style';
import type { ListItemType, ListProps } from './type';

export type ListRowXstyle = (
  item: ListItemType,
  active: boolean,
) => Parameters<typeof styleProps>[0];

interface ListRowProps {
  active: boolean;
  classNames?: ListProps['classNames'];
  compact: boolean;
  item: ListItemType;
  onSelect: (item: ListItemType, event: MouseEvent<HTMLElement>) => void;
  styles?: ListProps['styles'];
  xstyle?: ListRowXstyle;
}

const ListRow = memo<ListRowProps>(
  ({ active, classNames, compact, item, onSelect, styles: customStyles, xstyle }) => {
    const { actions, avatar, danger, description, disabled, extra, href, icon, label, showAction } =
      item;

    const handleClick = (event: MouseEvent<HTMLElement>) => {
      if (disabled) {
        event.preventDefault();
        return;
      }
      onSelect(item, event);
    };

    const rowClassName = styleProps(
      [
        focusRing.info,
        styles.row,
        compact && styles.compactRow,
        active && styles.active,
        danger && styles.danger,
        disabled && styles.disabled,
        xstyle?.(item, active),
      ],
      clsx(listClasses('item'), classNames?.item, item.className),
    ).className;
    const rowStyle = { ...customStyles?.item, ...item.style };
    const rowData = toDataAttributes({ active, danger, disabled });

    const content = (
      <>
        {avatar ?? (icon ? <Icon icon={icon} size={16} /> : null)}
        <span {...styleProps(styles.body, listClasses('body'))}>
          <span
            {...styleProps(
              styles.label,
              clsx('lobe-list-label', listClasses('label'), classNames?.label),
              customStyles?.label,
            )}
          >
            {label}
          </span>
          {description != null && (
            <span
              {...styleProps(
                styles.description,
                clsx(listClasses('description'), classNames?.description),
                customStyles?.description,
              )}
            >
              {description}
            </span>
          )}
        </span>
        {extra != null && (
          <span
            {...styleProps(
              styles.extra,
              clsx(listClasses('extra'), classNames?.extra),
              customStyles?.extra,
            )}
          >
            {extra}
          </span>
        )}
      </>
    );

    return (
      <li {...styleProps([styles.item, listItemMarker], listClasses('row'))}>
        {href && !disabled ? (
          <A
            aria-current={active ? 'page' : undefined}
            className={rowClassName}
            {...rowData}
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
            {...rowData}
            style={rowStyle}
            type="button"
            onClick={handleClick}
          >
            {content}
          </button>
        )}
        {actions != null && (
          <span
            {...styleProps(
              [styles.actions, showAction && styles.showAction],
              clsx(listClasses('actions'), classNames?.actions),
              customStyles?.actions,
            )}
          >
            {actions}
          </span>
        )}
      </li>
    );
  },
);

ListRow.displayName = 'ListRow';

export default ListRow;
