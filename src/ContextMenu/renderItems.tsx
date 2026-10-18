import { ContextMenu } from '@base-ui/react/context-menu';
import * as stylex from '@stylexjs/stylex';
import clsx from 'clsx';
import { Check } from 'lucide-react';
import {
  type ComponentProps,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from 'react';
import { memo, useCallback, useState } from 'react';

import { menuClassNames, menuStyles, styles } from '@/DropdownMenu/sharedStyle';
import common from '@/i18n/resources/en/common';
import { useTranslation } from '@/i18n/useTranslation';
import Icon from '@/Icon';
import { getFloatingCollisionPadding } from '@/internal/floating';
import type { BaseMenuItemGroupType, BaseSubMenuType } from '@/internal/menu/baseItem';
import {
  getItemKey,
  getItemLabel,
  hasAnyIcon,
  hasCheckboxAndIcon,
  renderIcon,
  type RenderItemContentOptions,
  type RenderOptions,
} from '@/internal/menu/renderUtils';
import type { MenuDividerType, MenuInfo, MenuItemType } from '@/internal/menu/type';
import { SubmenuArrowIcon } from '@/internal/SubmenuArrowIcon';
import Switch from '@/Switch';
import { preventDefaultAndStopPropagation } from '@/utils/dom';

import { useLayerZIndex } from '../internal/zIndex';
import { contextMenuClasses } from './stable';
import {
  type ContextMenuCheckboxItem,
  type ContextMenuItem,
  type ContextMenuSwitchItem,
} from './type';

type ContextMenuPositionerProps = ComponentProps<typeof ContextMenu.Positioner>;

/**
 * Submenu positioners are portaled outside the root menu, so they must allocate
 * their own layer z-index (same pattern as DropdownMenu) rather than relying on
 * the fixed CSS fallback that can fall behind after repeated root openings (#608).
 */
const ContextMenuSubmenuPositioner = memo(
  ({ collisionPadding, style, ...rest }: ContextMenuPositionerProps) => {
    const explicitZIndex =
      typeof style !== 'function' && style?.zIndex != null && typeof style.zIndex === 'number'
        ? style.zIndex
        : undefined;
    const { zIndex, ref: zRef } = useLayerZIndex<HTMLDivElement>('floating', explicitZIndex);

    const resolvedStyle =
      typeof style === 'function'
        ? (state: any) => ({ zIndex, ...style(state) })
        : { zIndex, ...style };

    return (
      <ContextMenu.Positioner
        {...rest}
        className={clsx(styles.positioner, contextMenuClasses('positioner'))}
        collisionPadding={collisionPadding ?? getFloatingCollisionPadding()}
        ref={zRef as any}
        style={resolvedStyle}
      />
    );
  },
);

ContextMenuSubmenuPositioner.displayName = 'ContextMenuSubmenuPositioner';

export type { IconAlign, IconSpaceMode } from '@/internal/menu/renderUtils';

const EmptyMenuItem = memo(() => {
  const { t } = useTranslation(common);
  return (
    <ContextMenu.Item
      disabled
      className={clsx(
        stylex.props(menuStyles.item, menuStyles.empty).className,
        contextMenuClasses('item'),
      )}
    >
      <div className={clsx(styles.itemContent, contextMenuClasses('item-content'))}>
        <span className={clsx(styles.label, contextMenuClasses('label'))}>{t('common.empty')}</span>
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
      closeOnClick={closeOnClick}
      disabled={disabled}
      label={label}
      className={clsx(
        stylex.props(menuStyles.item, danger && menuStyles.danger).className,
        contextMenuClasses('item'),
      )}
      onClick={(e) => {
        e.preventDefault();
        if (!disabled) {
          handleCheckedChange(!checked);
        }
      }}
    >
      {children}
      <span
        className={clsx(styles.switchWrap, contextMenuClasses('switch'))}
        onFocus={(e) => e.stopPropagation()}
      >
        <Switch
          checked={checked}
          disabled={disabled}
          size="small"
          tabIndex={-1}
          onChange={handleCheckedChange}
          onClick={(_, e) => e.stopPropagation()}
        />
      </span>
    </ContextMenu.Item>
  );
};

const renderItemContent = (
  item: MenuItemType | BaseSubMenuType | ContextMenuCheckboxItem | ContextMenuSwitchItem,
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
    <div className={clsx(styles.labelGroup, contextMenuClasses('label-group'))}>
      <span className={clsx(styles.label, contextMenuClasses('label'))}>{label}</span>
      <span className={clsx(styles.desc, contextMenuClasses('desc'))}>{desc}</span>
    </div>
  ) : (
    <span className={clsx(styles.label, contextMenuClasses('label'))}>{label}</span>
  );

  return (
    <div
      className={clsx(
        stylex.props(menuStyles.itemContent, alignStart && menuStyles.itemContentAlignStart)
          .className,
        contextMenuClasses('item-content'),
      )}
    >
      {shouldRenderIcon ? (
        <span
          aria-hidden={!hasIcon}
          className={clsx(
            stylex.props(menuStyles.icon, alignStart && menuStyles.iconAlignStart).className,
            menuClassNames.icon,
            contextMenuClasses('icon'),
          )}
        >
          {hasCustomIcon ? iconNode : hasIcon ? renderIcon(item.icon, 'small') : null}
        </span>
      ) : null}
      {labelNode}
      {extra ? (
        <span className={clsx(styles.extra, contextMenuClasses('extra'))}>{extra}</span>
      ) : null}
      {indicatorOnRight && iconNode ? iconNode : null}
      {options?.submenu ? (
        <span className={clsx(styles.submenuArrow, contextMenuClasses('submenu-arrow'))}>
          <SubmenuArrowIcon />
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
        <ContextMenu.CheckboxItemIndicator className={contextMenuClasses('checkbox-indicator')}>
          <Icon icon={Check} size={'small'} />
        </ContextMenu.CheckboxItemIndicator>
      );

      return (
        <ContextMenu.CheckboxItem
          checked={checkboxItem.checked}
          closeOnClick={checkboxItem.closeOnClick}
          defaultChecked={checkboxItem.defaultChecked}
          disabled={checkboxItem.disabled}
          key={itemKey}
          label={labelText}
          className={clsx(
            stylex.props(menuStyles.item, isDanger && menuStyles.danger).className,
            contextMenuClasses('item'),
          )}
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
      return (
        <ContextMenu.Separator
          className={clsx(styles.separator, contextMenuClasses('separator'))}
          key={itemKey}
        />
      );
    }

    if ((item as BaseMenuItemGroupType).type === 'group') {
      const group = item as BaseMenuItemGroupType;
      const groupReserveIconSpace =
        iconSpaceMode === 'group'
          ? group.children
            ? hasAnyIcon(group.children)
            : false
          : reserveIconSpace;
      const groupIndicatorOnRight = group.children ? hasCheckboxAndIcon(group.children) : false;
      return (
        <ContextMenu.Group className={contextMenuClasses('group')} key={itemKey}>
          {group.label ? (
            <ContextMenu.GroupLabel
              className={clsx(styles.groupLabel, contextMenuClasses('group-label'))}
            >
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
      (item as BaseSubMenuType).type === 'submenu' ||
      ('children' in item && (item as BaseSubMenuType).children)
    ) {
      const submenu = item as BaseSubMenuType;
      const label = getItemLabel(submenu);
      const labelText = typeof label === 'string' ? label : undefined;
      const isDanger = 'danger' in submenu && Boolean(submenu.danger);
      const submenuHasSlots = submenu.header != null || submenu.footer != null;
      const submenuBody =
        submenu.children && submenu.children.length > 0 ? (
          renderContextMenuItems(submenu.children, nextKeyPath, {
            iconAlign,
            iconSpaceMode,
          })
        ) : (
          <EmptyMenuItem />
        );

      return (
        <ContextMenu.SubmenuRoot
          defaultOpen={submenu.defaultOpen}
          key={itemKey}
          open={submenu.open}
          onOpenChange={submenu.onOpenChange}
        >
          <ContextMenu.SubmenuTrigger
            {...submenu.triggerProps}
            closeDelay={submenu.closeDelay}
            delay={submenu.delay}
            disabled={submenu.disabled}
            label={labelText}
            openOnHover={submenu.openOnHover}
            className={clsx(
              stylex.props(menuStyles.item, isDanger && menuStyles.danger).className,
              contextMenuClasses('item'),
            )}
            onClick={submenu.onClick}
          >
            {renderItemContent(submenu, {
              iconAlign,
              reserveIconSpace,
              submenu: true,
            })}
          </ContextMenu.SubmenuTrigger>
          <ContextMenu.Portal>
            <ContextMenuSubmenuPositioner
              alignOffset={-4}
              data-submenu=""
              sideOffset={-1}
              onContextMenu={preventDefaultAndStopPropagation}
            >
              <ContextMenu.Popup
                className={clsx(
                  stylex.props(menuStyles.popup, submenuHasSlots && menuStyles.popupWithSlots)
                    .className,
                  menuClassNames.popup,
                  contextMenuClasses(),
                )}
              >
                {submenu.header == null ? null : (
                  <div className={clsx(styles.header, contextMenuClasses('header'))}>
                    {submenu.header}
                  </div>
                )}
                {submenuHasSlots ? (
                  <div className={clsx(styles.slotViewport, contextMenuClasses('viewport'))}>
                    {submenuBody}
                  </div>
                ) : (
                  submenuBody
                )}
                {submenu.footer == null ? null : (
                  <div className={clsx(styles.footer, contextMenuClasses('footer'))}>
                    {submenu.footer}
                  </div>
                )}
              </ContextMenu.Popup>
            </ContextMenuSubmenuPositioner>
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
        closeOnClick={menuItem.closeOnClick}
        disabled={menuItem.disabled}
        key={itemKey}
        label={labelText}
        className={clsx(
          stylex.props(menuStyles.item, isDanger && menuStyles.danger).className,
          contextMenuClasses('item'),
        )}
        onClick={(event) => invokeItemClick(menuItem, nextKeyPath, event)}
      >
        {renderItemContent(menuItem, { iconAlign, reserveIconSpace })}
      </ContextMenu.Item>
    );
  });
};
