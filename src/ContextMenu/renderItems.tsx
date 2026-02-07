import { ContextMenu } from '@base-ui/react/context-menu';
import { Switch } from 'antd';
import { cx } from 'antd-style';
import { Check, ChevronRight } from 'lucide-react';
import { type MenuInfo } from 'rc-menu/es/interface';
import {
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from 'react';
import { memo, useCallback, useState } from 'react';

import common from '@/i18n/resources/en/common';
import { useTranslation } from '@/i18n/useTranslation';
import Icon from '@/Icon';
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
import { preventDefaultAndStopPropagation } from '@/utils/dom';

import { styles } from './style';
import {
  type ContextMenuCheckboxItem,
  type ContextMenuItem,
  type ContextMenuSwitchItem,
} from './type';

export type { IconAlign, IconSpaceMode } from '@/Menu';

const EmptyMenuItem = memo(() => {
  const { t } = useTranslation(common);
  return (
    <ContextMenu.Item disabled className={cx(styles.item, styles.empty)}>
      <div className={styles.itemContent}>
        <span className={styles.label}>{t('common.empty')}</span>
      </div>
    </ContextMenu.Item>
  );
});

EmptyMenuItem.displayName = 'EmptyMenuItem';

interface ContextMenuSwitchItemInternalProps {
  checked?: boolean;
  children: ReactNode;
  closeOnClick?: boolean;
  danger?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  label?: string;
  onCheckedChange?: (checked: boolean) => void;
}

const ContextMenuSwitchItemInternal = ({
  checked: checkedProp,
  children,
  closeOnClick = false,
  danger,
  defaultChecked,
  disabled,
  label,
  onCheckedChange,
}: ContextMenuSwitchItemInternalProps) => {
  const [internalChecked, setInternalChecked] = useState(defaultChecked ?? false);
  const isControlled = checkedProp !== undefined;
  const checked = isControlled ? checkedProp : internalChecked;

  const handleCheckedChange = useCallback(
    (newChecked: boolean) => {
      if (!isControlled) {
        setInternalChecked(newChecked);
      }
      onCheckedChange?.(newChecked);
    },
    [isControlled, onCheckedChange],
  );

  return (
    <ContextMenu.Item
      className={cx(styles.item, danger && styles.danger)}
      closeOnClick={closeOnClick}
      disabled={disabled}
      label={label}
      onClick={(e) => {
        e.preventDefault();
        if (!disabled) {
          handleCheckedChange(!checked);
        }
      }}
    >
      {children}
      <Switch
        checked={checked}
        disabled={disabled}
        size="small"
        style={{ marginInlineStart: 16 }}
        onChange={handleCheckedChange}
        onClick={(_, e) => e.stopPropagation()}
      />
    </ContextMenu.Item>
  );
};

const renderItemContent = (
  item: MenuItemType | SubMenuType | ContextMenuCheckboxItem | ContextMenuSwitchItem,
  options?: RenderItemContentOptions,
  iconNode?: ReactNode,
) => {
  const label = getItemLabel(item);
  const desc = 'desc' in item ? item.desc : undefined;
  const extra = 'extra' in item ? item.extra : undefined;
  const indicatorOnRight = options?.indicatorOnRight;
  const alignStart = Boolean(desc) && options?.iconAlign === 'start';
  const hasCustomIcon = iconNode !== undefined && !indicatorOnRight;
  const hasIcon = hasCustomIcon ? Boolean(iconNode) : Boolean(item.icon);
  const shouldRenderIcon = hasCustomIcon
    ? Boolean(options?.reserveIconSpace || iconNode)
    : Boolean(hasIcon || options?.reserveIconSpace);

  const labelNode = desc ? (
    <div className={styles.labelGroup}>
      <span className={styles.label}>{label}</span>
      <span className={styles.desc}>{desc}</span>
    </div>
  ) : (
    <span className={styles.label}>{label}</span>
  );

  return (
    <div className={cx(styles.itemContent, alignStart && styles.itemContentAlignStart)}>
      {shouldRenderIcon ? (
        <span
          aria-hidden={!hasIcon}
          className={cx(styles.icon, alignStart && styles.iconAlignStart)}
        >
          {hasCustomIcon ? iconNode : hasIcon ? renderIcon(item.icon, 'small') : null}
        </span>
      ) : null}
      {labelNode}
      {extra ? <span className={styles.extra}>{extra}</span> : null}
      {indicatorOnRight && iconNode ? iconNode : null}
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
  items: ContextMenuItem[],
  keyPath: string[] = [],
  options?: RenderOptions,
): ReactNode[] => {
  const iconAlign = options?.iconAlign;
  const iconSpaceMode = options?.iconSpaceMode ?? 'global';
  const reserveIconSpace =
    options?.reserveIconSpace ?? hasAnyIcon(items, iconSpaceMode === 'global');
  const indicatorOnRight = options?.indicatorOnRight ?? hasCheckboxAndIcon(items);

  return items.map((item, index) => {
    if (!item) return null;

    const fallbackKey = `${keyPath.join('-') || 'root'}-${index}`;
    const itemKey = getItemKey(item, fallbackKey);
    const nextKeyPath = [...keyPath, String(itemKey)];

    if ((item as ContextMenuCheckboxItem).type === 'checkbox') {
      const checkboxItem = item as ContextMenuCheckboxItem;
      const label = getItemLabel(checkboxItem);
      const labelText = typeof label === 'string' ? label : undefined;
      const isDanger = Boolean(checkboxItem.danger);
      const indicator = (
        <ContextMenu.CheckboxItemIndicator>
          <Icon icon={Check} size={'small'} />
        </ContextMenu.CheckboxItemIndicator>
      );

      return (
        <ContextMenu.CheckboxItem
          checked={checkboxItem.checked}
          className={cx(styles.item, isDanger && styles.danger)}
          closeOnClick={checkboxItem.closeOnClick}
          defaultChecked={checkboxItem.defaultChecked}
          disabled={checkboxItem.disabled}
          key={itemKey}
          label={labelText}
          onCheckedChange={(checked) => checkboxItem.onCheckedChange?.(checked)}
        >
          {renderItemContent(
            checkboxItem,
            { iconAlign, indicatorOnRight, reserveIconSpace },
            indicator,
          )}
        </ContextMenu.CheckboxItem>
      );
    }

    if ((item as ContextMenuSwitchItem).type === 'switch') {
      const switchItem = item as ContextMenuSwitchItem;
      const label = getItemLabel(switchItem);
      const labelText = typeof label === 'string' ? label : undefined;
      const isDanger = Boolean(switchItem.danger);

      return (
        <ContextMenuSwitchItemInternal
          checked={switchItem.checked}
          closeOnClick={switchItem.closeOnClick}
          danger={isDanger}
          defaultChecked={switchItem.defaultChecked}
          disabled={switchItem.disabled}
          key={itemKey}
          label={labelText}
          onCheckedChange={switchItem.onCheckedChange}
        >
          {renderItemContent(switchItem, { iconAlign, reserveIconSpace })}
        </ContextMenuSwitchItemInternal>
      );
    }

    if ((item as MenuDividerType).type === 'divider') {
      return <ContextMenu.Separator className={styles.separator} key={itemKey} />;
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
        <ContextMenu.Group key={itemKey}>
          {group.label ? (
            <ContextMenu.GroupLabel className={styles.groupLabel}>
              {group.label}
            </ContextMenu.GroupLabel>
          ) : null}
          {group.children
            ? renderContextMenuItems(group.children, nextKeyPath, {
                iconAlign,
                iconSpaceMode,
                indicatorOnRight: groupIndicatorOnRight,
                reserveIconSpace: groupReserveIconSpace,
              })
            : null}
        </ContextMenu.Group>
      );
    }

    if (
      (item as SubMenuType).type === 'submenu' ||
      ('children' in item && (item as SubMenuType).children)
    ) {
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
              iconAlign,
              reserveIconSpace,
              submenu: true,
            })}
          </ContextMenu.SubmenuTrigger>
          <ContextMenu.Portal>
            <ContextMenu.Positioner
              alignOffset={-4}
              className={styles.positioner}
              data-submenu=""
              sideOffset={-1}
              onContextMenu={preventDefaultAndStopPropagation}
            >
              <ContextMenu.Popup className={styles.popup}>
                {submenu.children && submenu.children.length > 0 ? (
                  renderContextMenuItems(submenu.children, nextKeyPath, {
                    iconAlign,
                    iconSpaceMode,
                  })
                ) : (
                  <EmptyMenuItem />
                )}
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
        closeOnClick={menuItem.closeOnClick}
        disabled={menuItem.disabled}
        key={itemKey}
        label={labelText}
        onClick={(event) => invokeItemClick(menuItem, nextKeyPath, event)}
      >
        {renderItemContent(menuItem, { iconAlign, reserveIconSpace })}
      </ContextMenu.Item>
    );
  });
};
