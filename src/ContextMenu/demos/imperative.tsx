import {
  Block,
  ContextMenuHost,
  ContextMenuTrigger,
  type GenericItemType,
  Icon,
  Text,
  showContextMenu,
} from '@lobehub/ui';
import {
  CopyIcon,
  FolderOpenIcon,
  LinkIcon,
  ListIcon,
  PencilIcon,
  TableIcon,
  Trash2Icon,
} from 'lucide-react';
import type { MouseEvent } from 'react';
import { useCallback, useMemo, useState } from 'react';

export default () => {
  const [lastAction, setLastAction] = useState('none');

  const handleAction = useCallback((key: string) => setLastAction(key), []);

  const items = useMemo<GenericItemType[]>(
    () => [
      {
        icon: <Icon icon={FolderOpenIcon} />,
        key: 'open',
        label: 'Open',
        onClick: ({ key }) => handleAction(String(key)),
      },
      {
        icon: <Icon icon={CopyIcon} />,
        key: 'copy',
        label: 'Copy',
        onClick: ({ key }) => handleAction(String(key)),
      },
      { type: 'divider' },
      {
        extra: 'F2',
        icon: <Icon icon={PencilIcon} />,
        key: 'rename',
        label: 'Rename',
        onClick: ({ key }) => handleAction(String(key)),
      },
      {
        children: [
          {
            icon: <Icon icon={LinkIcon} />,
            key: 'share-link',
            label: 'Copy link',
            onClick: ({ key }) => handleAction(String(key)),
          },
          {
            key: 'share-email',
            label: 'Email',
            onClick: ({ key }) => handleAction(String(key)),
          },
        ],
        key: 'share',
        label: 'Share',
      },
      { type: 'divider' },
      {
        children: [
          {
            icon: <Icon icon={TableIcon} />,
            key: 'view-grid',
            label: 'Grid',
            onClick: ({ key }) => handleAction(String(key)),
          },
          {
            icon: <Icon icon={ListIcon} />,
            key: 'view-list',
            label: 'List',
            onClick: ({ key }) => handleAction(String(key)),
          },
        ],
        label: 'View',
        type: 'group',
      },
      {
        danger: true,
        icon: <Icon icon={Trash2Icon} />,
        key: 'delete',
        label: 'Delete',
        onClick: ({ key }) => handleAction(String(key)),
      },
    ],
    [handleAction],
  );

  const handleContextMenu = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      event.preventDefault();
      showContextMenu(items);
    },
    [items],
  );

  return (
    <>
      <ContextMenuTrigger onContextMenu={handleContextMenu}>
        <Block direction="vertical" gap={8} padding={16}>
          <Text as={'p'} strong>
            Right click this panel
          </Text>
          <Text as={'p'} type="secondary">
            Last action: {lastAction}
          </Text>
        </Block>
      </ContextMenuTrigger>
      <ContextMenuHost />
    </>
  );
};
