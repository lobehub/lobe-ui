import { Icon } from '@lobehub/ui';
import { Link } from 'dumi';
import { Bug, FileClock, GitFork, Github } from 'lucide-react';
import { FooterColumn, FooterColumnItem } from 'rc-footer/es/column';

interface GetColumnParameters {
  github?: string;
}
export const getColumns = ({ github }: GetColumnParameters) => {
  const resources: FooterColumn = {
    items: [
      {
        description: 'AIGC Components',
        openExternal: true,
        title: '🤯 Lobe UI',
        url: 'https://github.com/lobehub/lobe-ui',
      },
      {
        description: 'Chatbot Client',
        openExternal: true,
        title: '🤯 Lobe Chat',
        url: 'https://github.com/lobehub/lobe-chat',
      },
      {
        description: 'Node Flow Editor',
        openExternal: true,
        title: '🤯 Lobe Flow',
        url: 'https://github.com/lobehub/lobe-flow',
      },
    ],
    title: 'Resources',
  };
  const community: FooterColumn = {
    items: [
      github && {
        icon: <Icon icon={Bug} size="small" />,
        openExternal: true,
        title: 'Report Bug',
        url: `${github}/issues/new/choose`,
      },
      github && {
        icon: <Icon icon={GitFork} size="small" />,
        openExternal: true,
        title: 'Request Feature',
        url: `${github}/issues/new/choose`,
      },
    ].filter(Boolean) as FooterColumnItem[],
    title: 'Community',
  };

  const help: FooterColumn = {
    items: [
      github && {
        icon: <Icon icon={Github} size="small" />,
        openExternal: true,
        title: 'GitHub',
        url: github,
      },
      {
        LinkComponent: Link,
        icon: <Icon icon={FileClock} size="small" />,
        title: 'Changelog',
        url: '/changelog',
      },
    ].filter(Boolean) as FooterColumnItem[],
    title: 'Help',
  };

  const more: FooterColumn = {
    items: [
      {
        description: 'AI Commit CLI',
        openExternal: true,
        title: '💌 Lobe Commit',
        url: 'https://github.com/lobehub/lobe-commit',
      },
      {
        description: 'Lint Config',
        openExternal: true,
        title: '📐 Lobe Lint',
        url: 'https://github.com/lobehub/lobe-lint',
      },
    ],
    title: 'More Products',
  };

  return [resources, community, help, more];
};
