import {
  Avatar,
  Block,
  ContextMenuTrigger,
  Flexbox,
  type GenericItemType,
  Icon,
  showContextMenu,
  Text,
} from '@lobehub/ui';
import { CopyIcon, ExternalLinkIcon, PencilIcon, Share2Icon, Trash2Icon } from 'lucide-react';
import { type MouseEvent, useCallback, useMemo } from 'react';

export default () => {
  const items = useMemo<GenericItemType[]>(
    () => [
      { icon: <Icon icon={PencilIcon} />, key: 'edit', label: 'Edit' },
      { icon: <Icon icon={CopyIcon} />, key: 'duplicate', label: 'Duplicate' },
      { icon: <Icon icon={Share2Icon} />, key: 'share', label: 'Share' },
      { icon: <Icon icon={ExternalLinkIcon} />, key: 'open', label: 'Open in new tab' },
      { type: 'divider' },
      { danger: true, icon: <Icon icon={Trash2Icon} />, key: 'delete', label: 'Delete' },
    ],
    [],
  );

  const handleContextMenu = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      event.preventDefault();
      showContextMenu(items, {
        footer: <Text type="secondary">Last edited 2 hours ago</Text>,
        header: (
          <Flexbox horizontal align="center" gap={8}>
            <Avatar avatar="📄" size={28} />
            <Text strong>Project Roadmap.md</Text>
          </Flexbox>
        ),
      });
    },
    [items],
  );

  return (
    <ContextMenuTrigger onContextMenu={handleContextMenu}>
      <Block direction="vertical" gap={8} padding={16}>
        <Text strong as={'p'}>
          Right click this panel
        </Text>
        <Text as={'p'} type="secondary">
          The menu has a pinned header and footer
        </Text>
      </Block>
    </ContextMenuTrigger>
  );
};
