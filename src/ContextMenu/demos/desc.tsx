import {
  Block,
  ContextMenuTrigger,
  type GenericItemType,
  Icon,
  showContextMenu,
  Text,
} from '@lobehub/ui';
import { GithubIcon, GlobeIcon, PencilIcon, UploadIcon } from 'lucide-react';
import { type MouseEvent } from 'react';
import { useCallback, useMemo } from 'react';

export default () => {
  const items = useMemo<GenericItemType[]>(
    () => [
      {
        desc: 'Import from a direct SKILL.md link',
        icon: <Icon icon={GlobeIcon} />,
        key: 'import-url',
        label: 'Import from URL',
      },
      {
        desc: 'Import from a public GitHub repository',
        icon: <Icon icon={GithubIcon} />,
        key: 'import-github',
        label: 'Import from GitHub',
      },
      {
        desc: 'Upload a local .zip or .skill file',
        icon: <Icon icon={UploadIcon} />,
        key: 'upload-zip',
        label: 'Upload Zip',
      },
      {
        desc: 'Manually configure a custom MCP server',
        icon: <Icon icon={PencilIcon} />,
        key: 'add-custom',
        label: 'Add Custom MCP Skill',
      },
    ],
    [],
  );

  const handleContextMenu = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      event.preventDefault();
      showContextMenu(items, { iconAlign: 'start' });
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
          Each item has a description below the label
        </Text>
      </Block>
    </ContextMenuTrigger>
  );
};
