'use client';

import {
  type AutocompleteRootChangeEventDetails,
  type AutocompleteRootProps,
} from '@base-ui/react/autocomplete';
import type React from 'react';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';

import {
  EditorSlashMenuEmpty,
  EditorSlashMenuGroup,
  EditorSlashMenuGroupLabel,
  EditorSlashMenuHiddenInput,
  EditorSlashMenuList,
  EditorSlashMenuPopup,
  EditorSlashMenuPortal,
  EditorSlashMenuPositioner,
  EditorSlashMenuRoot,
} from './atoms';
import { MenuItemRenderer } from './MenuItemRenderer';
import { type EditorSlashMenuItems, type EditorSlashMenuOption as ItemType } from './type';
import { useKeyboardNavigation } from './useKeyboardNavigation';
import { useNormalizedItems } from './useNormalizedItems';
import { isGroup } from './utils';

type Props = {
  /** Anchor for positioning (caret virtual element, dom element, ref, etc.) */
  anchor?: React.ComponentProps<typeof EditorSlashMenuPositioner>['anchor'];
  defaultOpen?: boolean;

  /** Initial query string (uncontrolled) */
  defaultValue?: string;
  /** Optional custom empty state */
  empty?: React.ReactNode;
  hiddenInputProps?: React.ComponentProps<typeof EditorSlashMenuHiddenInput>;
  items: EditorSlashMenuItems;

  listProps?: React.ComponentProps<typeof EditorSlashMenuList>;
  onOpenChange?: (open: boolean, details: AutocompleteRootChangeEventDetails) => void;
  onOpenChangeComplete?: (open: boolean) => void;
  /** Called when a command is selected. */
  onSelect?: (item: ItemType, details: AutocompleteRootChangeEventDetails) => void;

  /** Called when query changes. By default, changes caused by item selection are ignored. */
  onValueChange?: (value: string, details: AutocompleteRootChangeEventDetails) => void;

  open?: boolean;
  popupProps?: React.ComponentProps<typeof EditorSlashMenuPopup>;
  portalProps?: Omit<React.ComponentProps<typeof EditorSlashMenuPortal>, 'container'> & {
    container?: HTMLElement | null;
  };
  positionerProps?: Omit<React.ComponentProps<typeof EditorSlashMenuPositioner>, 'anchor'>;

  /** Optional custom group label renderer */
  renderGroupLabel?: (label: string) => React.ReactNode;
  /** Optional custom item renderer */
  renderItem?: (item: ItemType) => React.ReactNode;
  /** Reserve icon space even when icon is missing */
  reserveIconSpace?: boolean;
  /** Pass-through props */
  rootProps?: Omit<
    AutocompleteRootProps<ItemType>,
    | 'items'
    | 'value'
    | 'defaultValue'
    | 'onValueChange'
    | 'open'
    | 'defaultOpen'
    | 'onOpenChange'
    | 'onOpenChangeComplete'
    | 'itemToStringValue'
  >;
  /** Whether selecting an item should propagate its filled value via `onValueChange`. */
  updateValueOnSelect?: boolean;

  /** Current query string (controlled) */
  value?: string;
  /**
   * Render a visually-hidden input element for keyboard navigation / screen readers.
   * Default is `false` because slash menus usually live inside an editor input.
   */
  withHiddenInput?: boolean;
};

const EditorSlashMenu = memo<Props>(
  ({
    items,
    anchor,

    open,
    defaultOpen,
    onOpenChange,
    onOpenChangeComplete,

    value,
    defaultValue,
    onValueChange,
    updateValueOnSelect = false,

    onSelect,

    empty = 'No results',
    renderGroupLabel,
    renderItem,
    reserveIconSpace = true,

    rootProps,
    portalProps,
    positionerProps,
    popupProps,
    listProps,

    withHiddenInput = false,
    hiddenInputProps,
  }) => {
    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen ?? false);

    useEffect(() => {
      if (open === undefined) return;
      setUncontrolledOpen(open);
    }, [open]);

    const resolvedOpen = open ?? uncontrolledOpen;

    const { resolvedItems, hasAnyIcon } = useNormalizedItems(items);
    const { listRef } = useKeyboardNavigation({ isOpen: resolvedOpen });

    const itemToStringValue = useCallback((item: ItemType) => {
      const kws = item.keywords?.length ? ` ${item.keywords.join(' ')}` : '';
      return `${item.label}${kws}`;
    }, []);

    const handleValueChange = useCallback(
      (nextValue: string, details: AutocompleteRootChangeEventDetails) => {
        if (!updateValueOnSelect && details.reason === 'item-press') return;
        onValueChange?.(nextValue, details);
      },
      [onValueChange, updateValueOnSelect],
    );

    const handleSelect = useCallback(
      (item: ItemType, details: AutocompleteRootChangeEventDetails) => {
        onSelect?.(item, details);
      },
      [onSelect],
    );

    const handleOpenChange = useCallback(
      (nextOpen: boolean, details: AutocompleteRootChangeEventDetails) => {
        setUncontrolledOpen(nextOpen);
        onOpenChange?.(nextOpen, details);
      },
      [onOpenChange],
    );

    // Stable ref callback that doesn't depend on listProps object
    const setListRef = useCallback(
      (node: HTMLDivElement | null) => {
        listRef.current = node;
        const externalRef = (listProps as any)?.ref;
        if (!externalRef) return;
        if (typeof externalRef === 'function') {
          externalRef(node);
        } else {
          (externalRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      },
      [listRef, listProps],
    );

    // Memoize render props to prevent recreating on every render
    const menuItemProps = useMemo(
      () => ({
        hasAnyIcon,
        onSelect: handleSelect,
        renderItem,
        reserveIconSpace,
      }),
      [hasAnyIcon, handleSelect, renderItem, reserveIconSpace],
    );

    return (
      <EditorSlashMenuRoot<ItemType>
        {...(rootProps as any)}
        defaultOpen={defaultOpen}
        defaultValue={defaultValue}
        itemToStringValue={itemToStringValue as any}
        items={resolvedItems as any}
        open={open}
        value={value}
        onOpenChange={handleOpenChange}
        onOpenChangeComplete={onOpenChangeComplete}
        onValueChange={handleValueChange}
      >
        {withHiddenInput ? <EditorSlashMenuHiddenInput {...(hiddenInputProps as any)} /> : null}

        <EditorSlashMenuPortal {...(portalProps as any)}>
          <EditorSlashMenuPositioner {...(positionerProps as any)} anchor={anchor}>
            <EditorSlashMenuPopup {...(popupProps as any)}>
              <EditorSlashMenuList {...(listProps as any)} ref={setListRef as any}>
                {(entry: any) => {
                  if (isGroup(entry)) {
                    return (
                      <EditorSlashMenuGroup
                        key={entry.label ?? entry.items.map((i: any) => i.value).join('|')}
                      >
                        {entry.label
                          ? (renderGroupLabel?.(entry.label) ?? (
                              <EditorSlashMenuGroupLabel>{entry.label}</EditorSlashMenuGroupLabel>
                            ))
                          : null}
                        {entry.items.map((item: ItemType) => (
                          <MenuItemRenderer {...menuItemProps} item={item} key={item.value} />
                        ))}
                      </EditorSlashMenuGroup>
                    );
                  }

                  const item = entry as ItemType;
                  return <MenuItemRenderer {...menuItemProps} item={item} key={item.value} />;
                }}
              </EditorSlashMenuList>

              <EditorSlashMenuEmpty>{empty}</EditorSlashMenuEmpty>
            </EditorSlashMenuPopup>
          </EditorSlashMenuPositioner>
        </EditorSlashMenuPortal>
      </EditorSlashMenuRoot>
    );
  },
);

EditorSlashMenu.displayName = 'EditorSlashMenu';

export default EditorSlashMenu;
