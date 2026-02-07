import { Block, DropdownMenu, type DropdownMenuProps, Icon, Text } from '@lobehub/ui';
import { createStaticStyles } from 'antd-style';
import { GlobeIcon, MoreHorizontal, PencilIcon, UploadIcon } from 'lucide-react';

const triggerStyles = createStaticStyles(({ css, cssVar }) => ({
  trigger: css`
    cursor: pointer;

    display: inline-flex;
    align-items: center;
    justify-content: center;

    width: 44px;
    height: 44px;
    padding: 0;
    border: 1px solid ${cssVar.colorBorderSecondary};
    border-radius: 12px;

    color: ${cssVar.colorTextSecondary};

    background: ${cssVar.colorBgElevated};

    transition: all 150ms ${cssVar.motionEaseOut};

    &:hover {
      color: ${cssVar.colorText};
      background: ${cssVar.colorFillSecondary};
    }

    &:active {
      transform: translateY(1px);
    }

    &[data-state='open'],
    &[aria-expanded='true'] {
      color: ${cssVar.colorText};
      background: ${cssVar.colorFillTertiary};
    }
  `,
}));

const items: Exclude<DropdownMenuProps['items'], () => unknown> = [
  {
    desc: 'Import from a direct SKILL.md link',
    icon: <Icon icon={GlobeIcon} />,
    key: 'import-url',
    label: 'Import from URL',
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
];

export default () => {
  return (
    <Block direction="horizontal" gap={32} variant="borderless">
      <Block align="center" direction="vertical" gap={8} variant="borderless">
        <Text type="secondary">center (default)</Text>
        <DropdownMenu nativeButton items={items}>
          <button aria-label="Open menu" className={triggerStyles.trigger} type="button">
            <MoreHorizontal />
          </button>
        </DropdownMenu>
      </Block>
      <Block align="center" direction="vertical" gap={8} variant="borderless">
        <Text type="secondary">start</Text>
        <DropdownMenu nativeButton iconAlign="start" items={items}>
          <button aria-label="Open menu" className={triggerStyles.trigger} type="button">
            <MoreHorizontal />
          </button>
        </DropdownMenu>
      </Block>
    </Block>
  );
};
