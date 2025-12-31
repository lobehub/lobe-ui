import { Menu } from '@base-ui/react/menu';
import { cx } from 'antd-style';
import { Check, ChevronRight } from 'lucide-react';
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
  ItemType,
  MenuDividerType,
  MenuItemGroupType,
  MenuItemType,
  SubMenuType,
} from '@/Menu';
import { styles } from '@/Menu/sharedStyle';

import type { DropdownItem, DropdownMenuCheckboxItem } from './type';

const getItemKey = (item: ItemType | DropdownItem, fallback: string): Key => {
  if (item && 'key' in item && item.key !== undefined) return item.key;
  return fallback;
};

type LabelableItem = {
  key?: Key;
  label?: ReactNode;
  title?: ReactNode;
};

const getItemLabel = (item: MenuItemType | SubMenuType | LabelableItem): ReactNode => {
  if (item.label !== undefined) return item.label;
  if ('title' in item && item.title !== undefined) return item.title;
  return item.key;
};

const renderIcon = (icon: MenuItemType['icon']) => {
  if (!icon) return null;
  if (isValidElement(icon)) return icon;
  return <Icon icon={icon} />;
};

const getReserveIconSpaceMap = (items: DropdownItem[]) => {
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
    if ((item as DropdownMenuCheckboxItem).type === 'checkbox') {
      segmentHasIcon = true;
      return;
    }
    if ('icon' in item && item.icon) segmentHasIcon = true;
  });

  flush();
  return flags;
};

const renderItemContent = (
  item: MenuItemType | SubMenuType | DropdownMenuCheckboxItem,
  options?: { reserveIconSpace?: boolean; submenu?: boolean },
  iconNode?: ReactNode,
) => {
  const label = getItemLabel(item);
  const extra = 'extra' in item ? item.extra : undefined;
  const hasCustomIcon = iconNode !== undefined;
  const hasIcon = hasCustomIcon ? Boolean(iconNode) : Boolean(item.icon);
  const shouldRenderIcon = hasCustomIcon
    ? Boolean(options?.reserveIconSpace || iconNode)
    : Boolean(hasIcon || options?.reserveIconSpace);

  return (
    <div className={styles.itemContent}>
      {shouldRenderIcon ? (
        <span aria-hidden={!hasIcon} className={styles.icon}>
          {hasCustomIcon ? iconNode : hasIcon ? renderIcon(item.icon) : null}
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

export const renderDropdownMenuItems = (
  items: DropdownItem[],
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

    if ((item as DropdownMenuCheckboxItem).type === 'checkbox') {
      const checkboxItem = item as DropdownMenuCheckboxItem;
      const label = getItemLabel(checkboxItem);
      const labelText = typeof label === 'string' ? label : undefined;
      const isDanger = Boolean(checkboxItem.danger);
      const indicator = (
        <Menu.CheckboxItemIndicator>
          <Icon icon={Check} />
        </Menu.CheckboxItemIndicator>
      );

      return (
        <Menu.CheckboxItem
          checked={checkboxItem.checked}
          className={cx(styles.item, isDanger && styles.danger)}
          closeOnClick={checkboxItem.closeOnClick}
          defaultChecked={checkboxItem.defaultChecked}
          disabled={checkboxItem.disabled}
          key={itemKey}
          label={labelText}
          onCheckedChange={(checked) => checkboxItem.onCheckedChange?.(checked)}
        >
          {renderItemContent(checkboxItem, { reserveIconSpace }, indicator)}
        </Menu.CheckboxItem>
      );
    }

    if ((item as MenuDividerType).type === 'divider') {
      return <Menu.Separator className={styles.separator} key={itemKey} />;
    }

    if ((item as MenuItemGroupType).type === 'group') {
      const group = item as MenuItemGroupType;
      const groupReserveIconSpace = Boolean(
        group.children?.some((child) => Boolean(child && 'icon' in child && child.icon)),
      );
      return (
        <Menu.Group key={itemKey}>
          {group.label ? (
            <Menu.GroupLabel className={styles.groupLabel}>{group.label}</Menu.GroupLabel>
          ) : null}
          {group.children
            ? renderDropdownMenuItems(group.children, nextKeyPath, {
                reserveIconSpace: groupReserveIconSpace,
              })
            : null}
        </Menu.Group>
      );
    }

    if ((item as SubMenuType).type === 'submenu' || 'children' in item) {
      const submenu = item as SubMenuType;
      const label = getItemLabel(submenu);
      const labelText = typeof label === 'string' ? label : undefined;
      const isDanger = 'danger' in submenu && Boolean(submenu.danger);

      return (
        <Menu.SubmenuRoot key={itemKey}>
          <Menu.SubmenuTrigger
            className={cx(styles.item, isDanger && styles.danger)}
            disabled={submenu.disabled}
            label={labelText}
          >
            {renderItemContent(submenu, {
              reserveIconSpace,
              submenu: true,
            })}
          </Menu.SubmenuTrigger>
          <Menu.Portal>
            <Menu.Positioner alignOffset={-4} className={styles.positioner} sideOffset={-1}>
              <Menu.Popup className={styles.popup}>
                {submenu.children ? renderDropdownMenuItems(submenu.children, nextKeyPath) : null}
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.SubmenuRoot>
      );
    }

    const menuItem = item as MenuItemType;
    const label = getItemLabel(menuItem);
    const labelText = typeof label === 'string' ? label : undefined;
    const isDanger = 'danger' in menuItem && Boolean(menuItem.danger);

    return (
      <Menu.Item
        className={cx(styles.item, isDanger && styles.danger)}
        disabled={menuItem.disabled}
        key={itemKey}
        label={labelText}
        onClick={(event) => invokeItemClick(menuItem, nextKeyPath, event)}
      >
        {renderItemContent(menuItem, { reserveIconSpace })}
      </Menu.Item>
    );
  });
};
