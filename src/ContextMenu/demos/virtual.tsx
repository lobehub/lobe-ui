import { Block, ContextMenuTrigger, type GenericItemType, Text } from '@lobehub/ui';
import { FileTextIcon } from 'lucide-react';
import { useMemo } from 'react';

export default () => {
  const items = useMemo<GenericItemType[]>(
    () =>
      Array.from({ length: 1000 }, (_, index) => ({
        icon: FileTextIcon,
        key: `file-${index + 1}`,
        label: `file-${index + 1}.md`,
      })),
    [],
  );

  return (
    <ContextMenuTrigger
      virtual
      footer={<Text type="secondary">1000 files</Text>}
      header={<Text strong>Open file</Text>}
      items={items}
      listItemHeight={32}
    >
      <Block direction="vertical" gap={8} padding={16}>
        <Text strong as={'p'}>
          Right click this panel
        </Text>
        <Text as={'p'} type="secondary">
          Only the rows near the scroll position are mounted
        </Text>
      </Block>
    </ContextMenuTrigger>
  );
};
