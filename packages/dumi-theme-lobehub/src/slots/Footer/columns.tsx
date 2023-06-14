import { Icon } from '@lobehub/ui';
import { Link } from 'dumi';
import { Bug, FileClock, GitFork, Github } from 'lucide-react';
import { FooterColumn, FooterColumnItem } from 'rc-footer/es/column';

interface GetColumnParams {
  github?: string;
}
export const getColumns = ({ github }: GetColumnParams) => {
  const resources: FooterColumn = {
    title: 'Resources',
    items: [
      {
        title: '🤯 Lobe UI',
        description: 'AIGC Components',
        url: 'https://github.com/lobehub/lobe-ui',
        openExternal: true,
      },
      {
        title: '🤯 Lobe Chat',
        description: 'Chatbot Client',
        url: 'https://github.com/lobehub/lobe-chat',
        openExternal: true,
      },
      {
        title: '🤯 Lobe Flow',
        description: 'Node Flow Editor',
        url: 'https://github.com/lobehub/lobe-flow',
        openExternal: true,
      },
    ],
  };
  const community: FooterColumn = {
    title: 'Community',
    items: [
      github && {
        icon: <Icon icon={Bug} size="small" />,
        title: 'Report Bug',
        url: `${github}/issues/new/choose`,
        openExternal: true,
      },
      github && {
        icon: <Icon icon={GitFork} size="small" />,
        title: 'Request Feature',
        url: `${github}/issues/new/choose`,
        openExternal: true,
      },
    ].filter(Boolean) as FooterColumnItem[],
  };

  const help: FooterColumn = {
    title: 'Help',
    items: [
      github && {
        icon: <Icon icon={Github} size="small" />,
        title: 'GitHub',
        url: github,
        openExternal: true,
      },
      {
        icon: <Icon icon={FileClock} size="small" />,
        title: 'Changelog',
        url: '/changelog',
        LinkComponent: Link,
      },
    ].filter(Boolean) as FooterColumnItem[],
  };

  const more: FooterColumn = {
    title: 'More Products',
    items: [
      {
        title: '💌 Lobe Commit',
        description: 'AI Commit CLI',
        url: 'https://github.com/lobehub/lobe-commit',
        openExternal: true,
      },
      {
        title: '📐 Lobe Lint',
        description: 'Lint Config',
        url: 'https://github.com/lobehub/lobe-lint',
        openExternal: true,
      },
    ],
  };

  return [resources, community, help, more];
};
