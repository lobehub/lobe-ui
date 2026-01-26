import {
  Block,
  type ContextMenuItem,
  ContextMenuTrigger,
  Icon,
  Text,
  showContextMenu,
} from '@lobehub/ui';
import { FileIcon, FolderIcon, ImageIcon, SettingsIcon, VideoIcon } from 'lucide-react';
import type { MouseEvent } from 'react';
import { useCallback, useMemo } from 'react';

export default () => {
  const items = useMemo<ContextMenuItem[]>(
    () => [
      {
        children: [
          {
            icon: <Icon icon={FileIcon} />,
            key: 'new-file',
            label: 'New File',
          },
          {
            key: 'new-template',
            label: 'From Template',
          },
          {
            icon: <Icon icon={FolderIcon} />,
            key: 'new-folder',
            label: 'New Folder',
          },
        ],
        key: 'create',
        label: 'Create (mixed icons)',
        type: 'group',
      },
      {
        children: [
          {
            key: 'import-local',
            label: 'From Local',
          },
          {
            key: 'import-cloud',
            label: 'From Cloud',
          },
        ],
        key: 'import',
        label: 'Import (no icons)',
        type: 'group',
      },
      {
        children: [
          {
            icon: <Icon icon={ImageIcon} />,
            key: 'media-image',
            label: 'Images',
          },
          {
            icon: <Icon icon={VideoIcon} />,
            key: 'media-video',
            label: 'Videos',
          },
        ],
        key: 'media',
        label: 'Media (all icons)',
        type: 'group',
      },
      {
        children: [
          {
            checked: true,
            key: 'auto-save',
            label: 'Auto Save',
            type: 'checkbox',
          },
          {
            icon: <Icon icon={SettingsIcon} />,
            key: 'preferences',
            label: 'Preferences',
          },
          {
            key: 'reset',
            label: 'Reset',
          },
        ],
        key: 'settings',
        label: 'Settings (checkbox + icons)',
        type: 'group',
      },
    ],
    [],
  );

  const handleGlobalMode = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      event.preventDefault();
      showContextMenu(items, { iconSpaceMode: 'global' });
    },
    [items],
  );

  const handleGroupMode = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      event.preventDefault();
      showContextMenu(items, { iconSpaceMode: 'group' });
    },
    [items],
  );

  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <ContextMenuTrigger onContextMenu={handleGlobalMode}>
        <Block direction="vertical" gap={8} padding={16}>
          <Text as={'p'} strong>
            Global Mode (Default)
          </Text>
          <Text as={'p'} type="secondary">
            Right click here
          </Text>
        </Block>
      </ContextMenuTrigger>
      <ContextMenuTrigger onContextMenu={handleGroupMode}>
        <Block direction="vertical" gap={8} padding={16}>
          <Text as={'p'} strong>
            Group Mode
          </Text>
          <Text as={'p'} type="secondary">
            Right click here
          </Text>
        </Block>
      </ContextMenuTrigger>
    </div>
  );
};
