'use client';

import clsx from 'clsx';
import { type Key, memo, type MouseEvent } from 'react';

import A from '@/A';
import Icon from '@/Icon';
import { a2uiStyles } from '@/internal/a2ui/styles';
import { focusRing } from '@/styles/stylex/focusRing';
import { styleProps } from '@/styles/stylex/props';
import { toDataAttributes } from '@/utils/bem';

import { markerStyles, styles } from './a2uiStyle';
import { listClasses } from './stable';
import type { ListItemType, ListProps } from './type';
import { isListDivider, normalizeListItem } from './utils';

const isNative = (marker: string) => marker === 'bullet' || marker === 'number';

/**
 * `List variant="a2ui"`. Adapted from CopilotKit Gen UI 2.0 standard catalog (MIT),
 * `standard/data.tsx` List / ListItem: native bullets or numbers, or rows with an icon or text
 * marker, a label with a value on the right, a description and children. Rows with `onClick`
 * (on the list or the item) or `href` are pickable buttons or links; they hide the value, which
 * is the payload of the pick.
 */
const A2uiList = memo<ListProps>(
  ({
    className,
    classNames,
    connector = 'none',
    direction = 'vertical',
    items,
    marker = 'bullet',
    maxMarkerSize,
    onClick,
    ref,
    start,
    style,
    styles: customStyles,
    // Menu-only props are not used by the a2ui list.
    activeKey: _activeKey,
    compact: _compact,
    defaultActiveKey: _defaultActiveKey,
    glide: _glide,
    onActiveChange: _onActiveChange,
    selectable: _selectable,
    variant = 'a2ui',
    ...rest
  }) => {
    const horizontal = direction === 'horizontal';
    const native = isNative(marker) && !horizontal;
    const hasConnector = connector === 'solid';
    const Tag = marker === 'number' ? 'ol' : 'ul';

    const handleClick = (item: ListItemType, key: Key, domEvent: MouseEvent<HTMLElement>) => {
      if (item.disabled) {
        domEvent.preventDefault();
        return;
      }
      domEvent.stopPropagation();
      const info = { domEvent, item, key };
      item.onClick?.(info);
      onClick?.(info);
    };

    return (
      <Tag
        ref={ref as never}
        // Safari drops the list role when list-style is none.
        role={native ? undefined : 'list'}
        start={Tag === 'ol' ? start : undefined}
        {...rest}
        {...toDataAttributes({ connector, direction, marker, variant })}
        {...styleProps(
          [
            a2uiStyles.base,
            styles.root,
            markerStyles[marker],
            native && styles.native,
            horizontal && styles.horizontal,
          ],
          clsx(listClasses(), className),
          style,
        )}
      >
        {items.map((raw, index) => {
          const item = normalizeListItem(raw, index);
          if (isListDivider(item)) {
            return (
              <li
                key={item.key ?? `divider-${index}`}
                role="separator"
                {...styleProps(styles.divider, listClasses('divider'))}
              />
            );
          }
          const {
            actions,
            avatar,
            children,
            description,
            disabled,
            extra,
            href,
            icon,
            label,
            marker: ownMarker,
            markerSize,
            value,
          } = item;
          const pickable = !disabled && (!!onClick || !!item.onClick || !!href);
          const size = markerSize ?? maxMarkerSize;
          const leading =
            avatar ??
            (icon ? <Icon icon={icon} size={{ size: 16, strokeWidth: 2 }} /> : (ownMarker ?? null));
          const shownValue = pickable ? undefined : (value ?? extra);

          const row = (
            <span
              {...styleProps(
                [
                  styles.row,
                  leading != null && styles.rowLeading,
                  hasConnector && styles.connector,
                ],
                clsx(listClasses('item'), classNames?.item, item.className),
                { ...customStyles?.item, ...item.style },
              )}
            >
              {leading != null && (
                <span
                  aria-hidden
                  {...styleProps(styles.marker, clsx(listClasses('marker'), classNames?.marker), {
                    ...(size === undefined ? undefined : { maxWidth: size, minWidth: size }),
                    ...customStyles?.marker,
                  })}
                >
                  {leading}
                </span>
              )}
              <span {...styleProps(styles.body, listClasses('body'))}>
                {(label != null || shownValue != null || actions != null) && (
                  <span {...styleProps(styles.labelLine)}>
                    <span
                      {...styleProps(
                        undefined,
                        clsx(listClasses('label'), classNames?.label),
                        customStyles?.label,
                      )}
                    >
                      {label}
                    </span>
                    {shownValue != null && (
                      <span
                        {...styleProps(
                          styles.value,
                          clsx(listClasses('value'), classNames?.value),
                          customStyles?.value,
                        )}
                      >
                        {shownValue}
                      </span>
                    )}
                    {actions != null && (
                      <span
                        {...styleProps(
                          styles.actions,
                          clsx(listClasses('actions'), classNames?.actions),
                          customStyles?.actions,
                        )}
                      >
                        {actions}
                      </span>
                    )}
                  </span>
                )}
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
                {children != null && (
                  <span
                    {...styleProps(
                      styles.children,
                      clsx(listClasses('children'), classNames?.extra),
                      customStyles?.extra,
                    )}
                  >
                    {children}
                  </span>
                )}
              </span>
            </span>
          );

          const buttonClass = styleProps(
            [focusRing.info, styles.button],
            listClasses('button'),
          ).className;

          return (
            <li
              aria-disabled={disabled || undefined}
              key={item.key}
              {...toDataAttributes({ disabled })}
              {...styleProps(
                [ownMarker != null && native && styles.hideMarker, disabled && styles.disabled],
                clsx(listClasses('row'), classNames?.row),
                customStyles?.row,
              )}
            >
              {pickable && href ? (
                <A
                  className={buttonClass}
                  href={href}
                  onClick={(event) => handleClick(item, item.key, event)}
                >
                  {row}
                </A>
              ) : pickable ? (
                <button
                  className={buttonClass}
                  type="button"
                  onClick={(event) => handleClick(item, item.key, event)}
                >
                  {row}
                </button>
              ) : (
                row
              )}
            </li>
          );
        })}
      </Tag>
    );
  },
);

A2uiList.displayName = 'A2uiList';

export default A2uiList;
