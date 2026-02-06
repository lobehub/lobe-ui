'use client';

import { Autocomplete } from '@base-ui/react/autocomplete';
import { cx } from 'antd-style';
import type React from 'react';

import { usePortalContainer } from '@/hooks/usePortalContainer';
import { styles as menuStyles } from '@/Menu/sharedStyle';

import { styles } from './style';

export const EDITOR_SLASH_MENU_CONTAINER_ATTR = 'data-lobe-ui-editor-slash-menu-container';

const mergeStateClassName = <TState,>(
  base: string,
  className: string | ((state: TState) => string | undefined) | undefined,
) => {
  if (typeof className === 'function') return (state: TState) => cx(base, className(state));
  return cx(base, className);
};

export const EditorSlashMenuRoot = Autocomplete.Root;
export const EditorSlashMenuList = ({
  ref,
  className,
  ...rest
}: React.ComponentProps<typeof Autocomplete.List> & {
  ref?: React.RefObject<HTMLDivElement | null>;
}) => {
  return (
    <Autocomplete.List
      {...rest}
      className={mergeStateClassName(cx(styles.list), className as any) as any}
      ref={ref}
    />
  );
};
EditorSlashMenuList.displayName = 'EditorSlashMenuList';

export type EditorSlashMenuPortalProps = React.ComponentProps<typeof Autocomplete.Portal> & {
  /**
   * When `container` is not provided, it uses a shared container created by `usePortalContainer`.
   */
  container?: HTMLElement | null;
};

export const EditorSlashMenuPortal = ({ container, ...rest }: EditorSlashMenuPortalProps) => {
  const defaultContainer = usePortalContainer(EDITOR_SLASH_MENU_CONTAINER_ATTR);
  return <Autocomplete.Portal container={container ?? defaultContainer} {...rest} />;
};
EditorSlashMenuPortal.displayName = 'EditorSlashMenuPortal';

export type EditorSlashMenuPositionerProps = React.ComponentProps<typeof Autocomplete.Positioner>;

export const EditorSlashMenuPositioner = ({
  className,
  align,
  positionMethod,
  side,
  sideOffset,
  ...rest
}: EditorSlashMenuPositionerProps) => {
  return (
    <Autocomplete.Positioner
      {...rest}
      align={align ?? 'start'}
      className={mergeStateClassName(menuStyles.positioner, className as any) as any}
      positionMethod={positionMethod ?? 'fixed'}
      side={side ?? 'bottom'}
      sideOffset={sideOffset ?? 6}
    />
  );
};
EditorSlashMenuPositioner.displayName = 'EditorSlashMenuPositioner';

export type EditorSlashMenuPopupProps = React.ComponentProps<typeof Autocomplete.Popup>;

export const EditorSlashMenuPopup = ({
  className,
  initialFocus = false,
  ...rest
}: EditorSlashMenuPopupProps) => {
  return (
    <Autocomplete.Popup
      {...rest}
      className={mergeStateClassName(menuStyles.popup, className as any) as any}
      initialFocus={initialFocus}
    />
  );
};
EditorSlashMenuPopup.displayName = 'EditorSlashMenuPopup';

export type EditorSlashMenuItemProps = React.ComponentProps<typeof Autocomplete.Item> & {
  danger?: boolean;
};

export const EditorSlashMenuItem = ({ className, danger, ...rest }: EditorSlashMenuItemProps) => {
  return (
    <Autocomplete.Item
      {...rest}
      className={(state) =>
        cx(
          menuStyles.item,
          danger && menuStyles.danger,
          typeof className === 'function' ? className(state) : className,
        )
      }
    />
  );
};
EditorSlashMenuItem.displayName = 'EditorSlashMenuItem';

export type EditorSlashMenuGroupProps = React.ComponentProps<typeof Autocomplete.Group>;
export const EditorSlashMenuGroup = Autocomplete.Group;

export type EditorSlashMenuGroupLabelProps = React.ComponentProps<typeof Autocomplete.GroupLabel>;

export const EditorSlashMenuGroupLabel = ({
  className,
  ...rest
}: EditorSlashMenuGroupLabelProps) => {
  return (
    <Autocomplete.GroupLabel
      {...rest}
      className={(state) =>
        cx(menuStyles.groupLabel, typeof className === 'function' ? className(state) : className)
      }
    />
  );
};
EditorSlashMenuGroupLabel.displayName = 'EditorSlashMenuGroupLabel';

export type EditorSlashMenuEmptyProps = React.ComponentProps<typeof Autocomplete.Empty>;

export const EditorSlashMenuEmpty = ({ className, ...rest }: EditorSlashMenuEmptyProps) => {
  return (
    <Autocomplete.Empty
      {...rest}
      className={(state) =>
        cx(
          menuStyles.item,
          menuStyles.empty,
          typeof className === 'function' ? className(state) : className,
        )
      }
    />
  );
};
EditorSlashMenuEmpty.displayName = 'EditorSlashMenuEmpty';

export type EditorSlashMenuItemContentProps = React.HTMLAttributes<HTMLDivElement>;
export const EditorSlashMenuItemContent = ({
  className,
  ...rest
}: EditorSlashMenuItemContentProps) => {
  return <div {...rest} className={cx(menuStyles.itemContent, className)} />;
};
EditorSlashMenuItemContent.displayName = 'EditorSlashMenuItemContent';

export type EditorSlashMenuItemIconProps = React.HTMLAttributes<HTMLSpanElement>;
export const EditorSlashMenuItemIcon = ({ className, ...rest }: EditorSlashMenuItemIconProps) => {
  return <span {...rest} className={cx(menuStyles.icon, className)} />;
};
EditorSlashMenuItemIcon.displayName = 'EditorSlashMenuItemIcon';

export type EditorSlashMenuItemLabelProps = React.HTMLAttributes<HTMLSpanElement>;
export const EditorSlashMenuItemLabel = ({ className, ...rest }: EditorSlashMenuItemLabelProps) => {
  return <span {...rest} className={cx(menuStyles.label, className)} />;
};
EditorSlashMenuItemLabel.displayName = 'EditorSlashMenuItemLabel';

export type EditorSlashMenuItemExtraProps = React.HTMLAttributes<HTMLSpanElement>;
export const EditorSlashMenuItemExtra = ({ className, ...rest }: EditorSlashMenuItemExtraProps) => {
  return <span {...rest} className={cx(menuStyles.extra, className)} />;
};
EditorSlashMenuItemExtra.displayName = 'EditorSlashMenuItemExtra';

export type EditorSlashMenuHiddenInputProps = React.ComponentProps<typeof Autocomplete.Input>;
export const EditorSlashMenuHiddenInput = ({
  className,
  ...rest
}: EditorSlashMenuHiddenInputProps) => {
  return (
    <Autocomplete.Input
      {...rest}
      className={mergeStateClassName(cx(styles.hiddenInput), className as any) as any}
    />
  );
};
EditorSlashMenuHiddenInput.displayName = 'EditorSlashMenuHiddenInput';
