import { Check, ChevronRight } from 'lucide-react';
import { type MenuInfo } from 'rc-menu/es/interface';
import {
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from 'react';

import {
  getItemKey,
  getItemLabel,
  hasAnyIcon,
  hasCheckboxAndIcon,
  type MenuDividerType,
  type MenuItemGroupType,
  type MenuItemType,
  renderIcon,
  type RenderItemContentOptions,
  type RenderOptions,
  type SubMenuType,
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
import {
  type DropdownItem,
  type DropdownMenuCheckboxItem as DropdownMenuCheckboxItemType,
  type DropdownMenuSwitchItem as DropdownMenuSwitchItemType,
} from './type';

export type { IconSpaceMode } from '@/Menu';

const renderItemContent = (
  item: MenuItemType | SubMenuType | DropdownMenuCheckboxItemType | DropdownMenuSwitchItemType,
  options?: RenderItemContentOptions,
  iconNode?: ReactNode,
) => {
  const label = getItemLabel(item);
  const extra = 'extra' in item ? item.extra : undefined;
  const indicatorOnRight = options?.indicatorOnRight;
  const hasCustomIcon = iconNode !== undefined && !indicatorOnRight;
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
      {indicatorOnRight && iconNode ? iconNode : null}
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
  options?: RenderOptions,
): ReactNode[] => {
  const iconSpaceMode = options?.iconSpaceMode ?? 'global';
  const reserveIconSpace =
    options?.reserveIconSpace ?? hasAnyIcon(items, iconSpaceMode === 'global');
  const indicatorOnRight = options?.indicatorOnRight ?? hasCheckboxAndIcon(items);

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
        <DropdownMenuCheckboxItemIndicator>{renderIcon(Check)}</DropdownMenuCheckboxItemIndicator>
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
          {renderItemContent(checkboxItem, { indicatorOnRight, reserveIconSpace }, indicator)}
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
      const groupReserveIconSpace =
        iconSpaceMode === 'group'
          ? group.children
            ? hasAnyIcon(group.children)
            : false
          : reserveIconSpace;
      const groupIndicatorOnRight = group.children ? hasCheckboxAndIcon(group.children) : false;
      return (
        <DropdownMenuGroup key={itemKey}>
          {group.label ? <DropdownMenuGroupLabel>{group.label}</DropdownMenuGroupLabel> : null}
          {group.children
            ? renderDropdownMenuItems(group.children, nextKeyPath, {
                iconSpaceMode,
                indicatorOnRight: groupIndicatorOnRight,
                reserveIconSpace: groupReserveIconSpace,
              })
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
            <DropdownMenuPositioner alignOffset={-4} data-submenu="" sideOffset={-1}>
              <DropdownMenuPopup>
                {submenu.children
                  ? renderDropdownMenuItems(submenu.children, nextKeyPath, { iconSpaceMode })
                  : null}
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
        closeOnClick={menuItem.closeOnClick}
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
