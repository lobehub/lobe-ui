import { DropdownMenu, type DropdownMenuProps, Icon } from '@lobehub/ui';
import { createStaticStyles } from 'antd-style';
import { GithubIcon, GlobeIcon, MoreHorizontal, PencilIcon, UploadIcon } from 'lucide-react';

const styles = createStaticStyles(({ css, cssVar }) => ({
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
];

export default () => {
  return (
    <DropdownMenu nativeButton iconAlign="start" items={items}>
      <button aria-label="Open menu" className={styles.trigger} type="button">
        <MoreHorizontal />
      </button>
    </DropdownMenu>
  );
};
