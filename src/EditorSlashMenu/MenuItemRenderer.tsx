import type { AutocompleteRootChangeEventDetails } from '@base-ui/react/autocomplete';
import { memo } from 'react';

import {
  EditorSlashMenuItem,
  EditorSlashMenuItemContent,
  EditorSlashMenuItemExtra,
  EditorSlashMenuItemIcon,
  EditorSlashMenuItemLabel,
} from './atoms';
import type { EditorSlashMenuOption } from './type';

interface MenuItemRendererProps {
  hasAnyIcon: boolean;
  item: EditorSlashMenuOption;
  onSelect: (item: EditorSlashMenuOption, details: AutocompleteRootChangeEventDetails) => void;
  renderItem?: (item: EditorSlashMenuOption) => React.ReactNode;
  reserveIconSpace: boolean;
}

const DefaultItemContent = memo<{
  hasAnyIcon: boolean;
  item: EditorSlashMenuOption;
  reserveIconSpace: boolean;
}>(({ item, hasAnyIcon, reserveIconSpace }) => (
  <EditorSlashMenuItemContent>
    <EditorSlashMenuItemIcon aria-hidden={!hasAnyIcon && !reserveIconSpace}>
      {item.icon ?? (reserveIconSpace && hasAnyIcon ? <span /> : null)}
    </EditorSlashMenuItemIcon>
    <EditorSlashMenuItemLabel>{item.label}</EditorSlashMenuItemLabel>
    {item.extra ? <EditorSlashMenuItemExtra>{item.extra}</EditorSlashMenuItemExtra> : null}
  </EditorSlashMenuItemContent>
));

DefaultItemContent.displayName = 'DefaultItemContent';

export const MenuItemRenderer = memo<MenuItemRendererProps>(
  ({ hasAnyIcon, item, onSelect, renderItem, reserveIconSpace }) => {
    const content = renderItem?.(item) ?? (
      <DefaultItemContent hasAnyIcon={hasAnyIcon} item={item} reserveIconSpace={reserveIconSpace} />
    );

    return (
      <EditorSlashMenuItem
        danger={item.danger}
        disabled={item.disabled}
        key={item.value}
        onClick={(e) => {
          if (item.disabled) {
            e.preventDefault();
            return;
          }
          onSelect(item, { event: e as any, reason: 'item-press' } as any);
        }}
        value={item as any}
      >
        {content}
      </EditorSlashMenuItem>
    );
  },
);

MenuItemRenderer.displayName = 'MenuItemRenderer';
