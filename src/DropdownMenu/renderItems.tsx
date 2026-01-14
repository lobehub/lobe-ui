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

import {
  DropdownMenuCheckboxItemIndicator,
  DropdownMenuCheckboxItemPrimitive,
  DropdownMenuGroup,
  DropdownMenuGroupLabel,
  DropdownMenuItem,
  DropdownMenuItemContent,
  DropdownMenuItemExtra,
  DropdownMenuItemIcon,
  DropdownMenuItemLabel,
  DropdownMenuPopup,
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownMenuSeparator,
  DropdownMenuSubmenuArrow,
  DropdownMenuSubmenuRoot,
  DropdownMenuSubmenuTrigger,
  DropdownMenuSwitchItem,
} from './atoms';
import type {
  DropdownItem,
  DropdownMenuCheckboxItem as DropdownMenuCheckboxItemType,
  DropdownMenuSwitchItem as DropdownMenuSwitchItemType,
} from './type';

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

const hasAnyIcon = (items: DropdownItem[]): boolean => {
  return items.some((item) => {
    if (!item) return false;
    if ((item as DropdownMenuCheckboxItemType).type === 'checkbox') return true;
    if ('icon' in item && item.icon) return true;
    return false;
  });
};

const renderItemContent = (
  item: MenuItemType | SubMenuType | DropdownMenuCheckboxItemType | DropdownMenuSwitchItemType,
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
    <DropdownMenuItemContent>
      {shouldRenderIcon ? (
        <DropdownMenuItemIcon aria-hidden={!hasIcon}>
          {hasCustomIcon ? iconNode : hasIcon ? renderIcon(item.icon) : null}
        </DropdownMenuItemIcon>
      ) : null}
      <DropdownMenuItemLabel>{label}</DropdownMenuItemLabel>
      {extra ? <DropdownMenuItemExtra>{extra}</DropdownMenuItemExtra> : null}
      {options?.submenu ? (
        <DropdownMenuSubmenuArrow>
          <ChevronRight size={16} />
        </DropdownMenuSubmenuArrow>
      ) : null}
    </DropdownMenuItemContent>
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
  const reserveIconSpace = options?.reserveIconSpace ?? hasAnyIcon(items);

  return items.map((item, index) => {
    if (!item) return null;

    const fallbackKey = `${keyPath.join('-') || 'root'}-${index}`;
    const itemKey = getItemKey(item, fallbackKey);
    const nextKeyPath = [...keyPath, String(itemKey)];

    if ((item as DropdownMenuCheckboxItemType).type === 'checkbox') {
      const checkboxItem = item as DropdownMenuCheckboxItemType;
      const label = getItemLabel(checkboxItem);
      const labelText = typeof label === 'string' ? label : undefined;
      const isDanger = Boolean(checkboxItem.danger);
      const indicator = (
        <DropdownMenuCheckboxItemIndicator>
          <Icon icon={Check} />
        </DropdownMenuCheckboxItemIndicator>
      );

      return (
        <DropdownMenuCheckboxItemPrimitive
          checked={checkboxItem.checked}
          closeOnClick={checkboxItem.closeOnClick}
          danger={isDanger}
          defaultChecked={checkboxItem.defaultChecked}
          disabled={checkboxItem.disabled}
          key={itemKey}
          label={labelText}
          onCheckedChange={(checked) => checkboxItem.onCheckedChange?.(checked)}
        >
          {renderItemContent(checkboxItem, { reserveIconSpace }, indicator)}
        </DropdownMenuCheckboxItemPrimitive>
      );
    }

    if ((item as DropdownMenuSwitchItemType).type === 'switch') {
      const switchItem = item as DropdownMenuSwitchItemType;
      const label = getItemLabel(switchItem);
      const labelText = typeof label === 'string' ? label : undefined;
      const isDanger = Boolean(switchItem.danger);

      return (
        <DropdownMenuSwitchItem
          checked={switchItem.checked}
          closeOnClick={switchItem.closeOnClick}
          danger={isDanger}
          defaultChecked={switchItem.defaultChecked}
          disabled={switchItem.disabled}
          key={itemKey}
          label={labelText}
          onCheckedChange={(checked) => switchItem.onCheckedChange?.(checked)}
        >
          {renderItemContent(switchItem, { reserveIconSpace })}
        </DropdownMenuSwitchItem>
      );
    }

    if ((item as MenuDividerType).type === 'divider') {
      return <DropdownMenuSeparator key={itemKey} />;
    }

    if ((item as MenuItemGroupType).type === 'group') {
      const group = item as MenuItemGroupType;
      return (
        <DropdownMenuGroup key={itemKey}>
          {group.label ? <DropdownMenuGroupLabel>{group.label}</DropdownMenuGroupLabel> : null}
          {group.children
            ? renderDropdownMenuItems(group.children, nextKeyPath, { reserveIconSpace })
            : null}
        </DropdownMenuGroup>
      );
    }

    if ((item as SubMenuType).type === 'submenu' || 'children' in item) {
      const submenu = item as SubMenuType;
      const label = getItemLabel(submenu);
      const labelText = typeof label === 'string' ? label : undefined;
      const isDanger = 'danger' in submenu && Boolean(submenu.danger);

      return (
        <DropdownMenuSubmenuRoot key={itemKey}>
          <DropdownMenuSubmenuTrigger
            danger={isDanger}
            disabled={submenu.disabled}
            label={labelText}
          >
            {renderItemContent(submenu, {
              reserveIconSpace,
              submenu: true,
            })}
          </DropdownMenuSubmenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuPositioner alignOffset={-4} sideOffset={-1}>
              <DropdownMenuPopup>
                {submenu.children ? renderDropdownMenuItems(submenu.children, nextKeyPath) : null}
              </DropdownMenuPopup>
            </DropdownMenuPositioner>
          </DropdownMenuPortal>
        </DropdownMenuSubmenuRoot>
      );
    }

    const menuItem = item as MenuItemType;
    const label = getItemLabel(menuItem);
    const labelText = typeof label === 'string' ? label : undefined;
    const isDanger = 'danger' in menuItem && Boolean(menuItem.danger);

    return (
      <DropdownMenuItem
        danger={isDanger}
        disabled={menuItem.disabled}
        key={itemKey}
        label={labelText}
        onClick={(event) => invokeItemClick(menuItem, nextKeyPath, event)}
      >
        {renderItemContent(menuItem, { reserveIconSpace })}
      </DropdownMenuItem>
    );
  });
};
