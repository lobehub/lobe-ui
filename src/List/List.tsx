'use client';

import clsx from 'clsx';
import { type Key, memo, type MouseEvent, type NamedExoticComponent, useState } from 'react';

import { styles as glideStyles } from '@/GlideHighlight/style';
import { useGlideHighlight } from '@/GlideHighlight/useGlideHighlight';
import { styleProps } from '@/styles/stylex/props';
import { toDataAttributes } from '@/utils/bem';
import { composeEventHandlers } from '@/utils/composeEventHandlers';
import { useMergeRefs } from '@/utils/mergeRefs';

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
    glide = false,
    items,
    onActiveChange,
    onBlurCapture,
    onClick,
    onFocusCapture,
    onMouseLeave,
    onMouseOver,
    ref,
    selectable = false,
    styles: customStyles,
    variant = 'borderless',
    itemXstyle,
    ...rest
  }) => {
    const [innerKey, setInnerKey] = useState<Key | undefined>(defaultActiveKey);
    const currentKey = activeKey === undefined ? innerKey : activeKey;

    const glideState = useGlideHighlight<HTMLUListElement>({
      disabled: !glide,
      rowSelector: `.${listClasses('item')}`,
    });
    const mergedRef = useMergeRefs([glideState.containerRef, ref]);
    // Without `glide` the caller's handlers pass through untouched.
    const { containerProps } = glideState;
    const glideHandlers = glide
      ? {
          onBlurCapture: composeEventHandlers(onBlurCapture, containerProps.onBlurCapture),
          onFocusCapture: composeEventHandlers(onFocusCapture, containerProps.onFocusCapture),
          onMouseLeave: composeEventHandlers(onMouseLeave, containerProps.onMouseLeave),
          onMouseOver: composeEventHandlers(onMouseOver, containerProps.onMouseOver),
        }
      : { onBlurCapture, onFocusCapture, onMouseLeave, onMouseOver };

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
        ref={mergedRef}
        role="list"
        className={
          styleProps(
            [styles.root, variantStyles[variant], glide && styles.glideRoot],
            clsx(listClasses(), className),
          ).className
        }
        {...toDataAttributes({ compact, glide, selectable, variant })}
        {...rest}
        {...glideHandlers}
      >
        {glide && (
          <li
            aria-hidden
            role="presentation"
            {...styleProps(
              [
                glideStyles.highlight,
                glideState.gliding && glideStyles.gliding,
                glideState.visible && glideStyles.visible,
              ],
              listClasses('glide'),
              glideState.highlightStyle,
            )}
          />
        )}
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
              glide={glide}
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
