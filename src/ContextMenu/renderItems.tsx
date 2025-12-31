import { ContextMenu } from '@base-ui/react/context-menu';
import { cx } from 'antd-style';
import { ChevronRight } from 'lucide-react';
import type { MenuInfo } from 'rc-menu/es/interface';
import type {
  Key,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  ReactNode,
} from 'react';
import { isValidElement } from 'react';

import Icon from '@/Icon';
import type {
  GenericItemType,
  ItemType,
  MenuDividerType,
  MenuItemGroupType,
  MenuItemType,
  SubMenuType,
} from '@/Menu';

import { styles } from './style';

const getItemKey = (item: ItemType, fallback: string): Key => {
  if (item && 'key' in item && item.key !== undefined) return item.key;
  return fallback;
};

const getItemLabel = (item: MenuItemType | SubMenuType): ReactNode => {
  if (item.label !== undefined) return item.label;
  if ('title' in item && item.title !== undefined) return item.title;
  return item.key;
};

const renderIcon = (icon: MenuItemType['icon']) => {
  if (!icon) return null;
  if (isValidElement(icon)) return icon;
  return <Icon icon={icon} size={'small'} />;
};

const getReserveIconSpaceMap = (items: GenericItemType[]) => {
  const flags = Array.from({ length: items.length }).fill(false);
  let segmentIndices: number[] = [];
  let segmentHasIcon = false;

  const flush = () => {
    if (segmentHasIcon) {
      for (const index of segmentIndices) flags[index] = true;
    }
    segmentIndices = [];
    segmentHasIcon = false;
  };

  items.forEach((item, index) => {
    if (!item) return;
    if (
      (item as MenuDividerType).type === 'divider' ||
      (item as MenuItemGroupType).type === 'group'
    ) {
      flush();
      return;
    }

    segmentIndices.push(index);
    if ('icon' in item && item.icon) segmentHasIcon = true;
  });

  flush();
  return flags;
};

const renderItemContent = (
  item: MenuItemType | SubMenuType,
  options?: { reserveIconSpace?: boolean; submenu?: boolean },
) => {
  const label = getItemLabel(item);
  const extra = 'extra' in item ? item.extra : undefined;
  const hasIcon = Boolean(item.icon);
  const shouldRenderIcon = hasIcon || options?.reserveIconSpace;

  return (
    <div className={styles.itemContent}>
      {shouldRenderIcon ? (
        <span aria-hidden={!hasIcon} className={styles.icon}>
          {hasIcon ? renderIcon(item.icon) : null}
        </span>
      ) : null}
      <span className={styles.label}>{label}</span>
      {extra ? <span className={styles.extra}>{extra}</span> : null}
      {options?.submenu ? (
        <span className={styles.submenuArrow}>
          <ChevronRight size={16} />
        </span>
      ) : null}
    </div>
  );
};

const invokeItemClick = (
  item: MenuItemType,
  keyPath: string[],
  event: ReactMouseEvent<HTMLElement> | ReactKeyboardEvent<HTMLElement>,
) => {
  if (!item.onClick) return;
  const key = item.key ?? keyPath.at(-1) ?? '';
  const info: MenuInfo = {
    domEvent: event,
    item: event.currentTarget as MenuInfo['item'],
    key: String(key),
    keyPath,
  };
  item.onClick(info);
};

export const renderContextMenuItems = (
  items: GenericItemType[],
  keyPath: string[] = [],
  options?: { reserveIconSpace?: boolean },
): ReactNode[] => {
  const reserveIconSpaceMap =
    options?.reserveIconSpace === undefined ? getReserveIconSpaceMap(items) : null;

  return items.map((item, index) => {
    if (!item) return null;

    const fallbackKey = `${keyPath.join('-') || 'root'}-${index}`;
    const itemKey = getItemKey(item, fallbackKey);
    const nextKeyPath = [...keyPath, String(itemKey)];
    const reserveIconSpace = options?.reserveIconSpace ?? Boolean(reserveIconSpaceMap?.[index]);

    if ((item as MenuDividerType).type === 'divider') {
      return <ContextMenu.Separator className={styles.separator} key={itemKey} />;
    }

    if ((item as MenuItemGroupType).type === 'group') {
      const group = item as MenuItemGroupType;
      const groupReserveIconSpace = Boolean(
        group.children?.some((child) => Boolean(child && 'icon' in child && child.icon)),
      );
      return (
        <ContextMenu.Group key={itemKey}>
          {group.label ? (
            <ContextMenu.GroupLabel className={styles.groupLabel}>
              {group.label}
            </ContextMenu.GroupLabel>
          ) : null}
          {group.children
            ? renderContextMenuItems(group.children, nextKeyPath, {
                reserveIconSpace: groupReserveIconSpace,
              })
            : null}
        </ContextMenu.Group>
      );
    }

    if ((item as SubMenuType).type === 'submenu' || 'children' in item) {
      const submenu = item as SubMenuType;
      const label = getItemLabel(submenu);
      const labelText = typeof label === 'string' ? label : undefined;
      const isDanger = 'danger' in submenu && Boolean(submenu.danger);

      return (
        <ContextMenu.SubmenuRoot key={itemKey}>
          <ContextMenu.SubmenuTrigger
            className={cx(styles.item, isDanger && styles.danger)}
            disabled={submenu.disabled}
            label={labelText}
          >
            {renderItemContent(submenu, {
              reserveIconSpace,
              submenu: true,
            })}
          </ContextMenu.SubmenuTrigger>
          <ContextMenu.Portal>
            <ContextMenu.Positioner alignOffset={-4} sideOffset={6}>
              <ContextMenu.Popup className={styles.popup}>
                {submenu.children ? renderContextMenuItems(submenu.children, nextKeyPath) : null}
              </ContextMenu.Popup>
            </ContextMenu.Positioner>
          </ContextMenu.Portal>
        </ContextMenu.SubmenuRoot>
      );
    }

    const menuItem = item as MenuItemType;
    const label = getItemLabel(menuItem);
    const labelText = typeof label === 'string' ? label : undefined;
    const isDanger = 'danger' in menuItem && Boolean(menuItem.danger);

    return (
      <ContextMenu.Item
        className={cx(styles.item, isDanger && styles.danger)}
        disabled={menuItem.disabled}
        key={itemKey}
        label={labelText}
        onClick={(event) => invokeItemClick(menuItem, nextKeyPath, event)}
      >
        {renderItemContent(menuItem, { reserveIconSpace })}
      </ContextMenu.Item>
    );
  });
};
