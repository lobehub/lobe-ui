import {
  Block,
  ContextMenuTrigger,
  type GenericItemType,
  showContextMenu,
  Text,
} from '@lobehub/ui';
import { type MouseEvent, useCallback, useMemo } from 'react';

export default () => {
  const items = useMemo<GenericItemType[]>(
    () =>
      Array.from({ length: 40 }, (_, index) => ({
        key: `chapter-${index + 1}`,
        label: `Chapter ${index + 1}`,
      })),
    [],
  );

  const handleContextMenu = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      event.preventDefault();
      showContextMenu(items, {
        footer: <Text type="secondary">40 chapters · scroll to explore</Text>,
        header: <Text strong>Jump to chapter</Text>,
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
          The items area scrolls while the header and footer stay pinned
        </Text>
      </Block>
    </ContextMenuTrigger>
  );
};
