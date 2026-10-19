import { Smile } from 'lucide-react';
import { useEffect } from 'react';

import AppElementContext from '@/ConfigProvider/AppElementContext';
import { contextMenuClasses } from '@/ContextMenu/stable';
import { drawerClasses } from '@/Drawer/stable';
import { dropdownMenuClasses } from '@/DropdownMenu/stable';
import { editorSlashMenuClasses } from '@/EditorSlashMenu/stable';
import { emojiPickerClasses } from '@/EmojiPicker/stable';
import { floatingPanelClasses } from '@/FloatingPanel/stable';
import { floatingSheetClasses } from '@/FloatingSheet/stable';
import {
  ContextMenuHost,
  ContextMenuTrigger,
  Drawer,
  DropdownMenu,
  EditorSlashMenu,
  EmojiPicker,
  FloatingPanel,
  FloatingSheet,
  Modal,
  showContextMenu,
  Tooltip,
} from '@/index';
import { modalClasses } from '@/Modal/stable';
import { tooltipClasses } from '@/Tooltip/stable';

import type { StableFixture } from './stableClasses.fixtures';

const MENU_ITEMS = [
  { desc: 'Desc', extra: '⌘K', icon: Smile, key: 'a', label: 'Alpha' },
  { type: 'divider' as const },
  {
    children: [{ key: 'b', label: 'Beta' }],
    key: 'g',
    label: 'Group',
    type: 'group' as const,
  },
];

const OpenContextMenu = ({ className }: { className?: string }) => {
  useEffect(() => {
    showContextMenu(MENU_ITEMS, { footer: 'Footer', header: 'Header' });
  }, []);
  return (
    <AppElementContext value={document.body as HTMLDivElement}>
      <ContextMenuHost />
      <ContextMenuTrigger className={className} items={MENU_ITEMS}>
        <div>Area</div>
      </ContextMenuTrigger>
    </AppElementContext>
  );
};

const MENU_CONDITIONAL = ['submenu-arrow', 'checkbox-indicator', 'switch'] as const;

export const OVERLAY_FIXTURES: Record<string, StableFixture> = {
  ContextMenuTrigger: {
    classNameTarget: 'trigger',
    classes: contextMenuClasses,
    conditional: MENU_CONDITIONAL,
    portal: true,
    render: ({ className }) => <OpenContextMenu className={className} />,
  },
  Drawer: {
    classes: drawerClasses,
    conditional: ['trigger', 'description'],
    portal: true,
    render: ({ className }) => (
      <Drawer
        open
        className={className}
        extra="Extra"
        footer="Footer"
        sidebar="Sidebar"
        title="Title"
      >
        Body
      </Drawer>
    ),
  },
  DropdownMenu: {
    classes: dropdownMenuClasses,
    conditional: [...MENU_CONDITIONAL, 'trigger'],
    portal: true,
    render: ({ className }) => (
      <DropdownMenu
        open
        footer="Footer"
        header="Header"
        items={MENU_ITEMS}
        popupProps={{ className }}
      >
        <button type="button">Open</button>
      </DropdownMenu>
    ),
  },
  EditorSlashMenu: {
    classes: editorSlashMenuClasses,
    conditional: ['input', 'empty'],
    portal: true,
    render: ({ className }) => (
      <EditorSlashMenu
        open
        anchor={document.body}
        popupProps={{ className }}
        items={[
          { icon: <Smile />, label: 'Alpha', value: 'a' },
          { extra: 'Extra', label: 'Beta', value: 'b' },
          { items: [{ label: 'Gamma', value: 'c' }], label: 'Group' },
        ]}
      />
    ),
  },
  EmojiPicker: {
    classNameTarget: 'trigger',
    classes: emojiPickerClasses,
    conditional: ['tabs', 'delete', 'uploader', 'custom-tab'],
    portal: true,
    render: ({ className }) => <EmojiPicker defaultOpen className={className} />,
  },
  FloatingPanel: {
    classes: floatingPanelClasses,
    conditional: ['backdrop'],
    portal: true,
    render: ({ className }) => (
      <FloatingPanel open actions="Actions" className={className} footer="Footer" title="Title">
        Body
      </FloatingPanel>
    ),
  },
  FloatingSheet: {
    classes: floatingSheetClasses,
    render: ({ className }) => (
      <FloatingSheet open className={className} headerActions="Actions" title="Title">
        Body
      </FloatingSheet>
    ),
  },
  Modal: {
    classes: modalClasses,
    conditional: ['trigger', 'viewport', 'description', 'fullscreen-toggle', 'loading'],
    portal: true,
    render: ({ className }) => (
      <Modal open className={className} title="Title">
        Body
      </Modal>
    ),
  },
  Tooltip: {
    classes: tooltipClasses,
    conditional: ['arrow'],
    portal: true,
    render: ({ className }) => (
      <Tooltip open className={className} popupContainer={document.body} title="Tip">
        <button type="button">Hover</button>
      </Tooltip>
    ),
  },
};
