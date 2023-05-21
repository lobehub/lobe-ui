import { GithubOutlined, HistoryOutlined, IssuesCloseOutlined } from '@ant-design/icons';
import { Link } from 'dumi';
import { FooterColumn, FooterColumnItem } from 'rc-footer/es/column';

interface GetColumnParams {
  github?: string;
}
export const getColumns = ({ github }: GetColumnParams) => {
  const resources: FooterColumn = {
    title: '相关资源',
    items: [],
  };
  const community: FooterColumn = {
    title: 'Social',
    items: [],
  };

  const more: FooterColumn = {
    title: 'More',
    items: [],
  };

  const help: FooterColumn = {
    title: 'Help',
    items: [
      github
        ? {
            icon: <GithubOutlined />,
            title: 'GitHub',
            url: github,
            openExternal: true,
          }
        : undefined,
      {
        icon: <HistoryOutlined />,
        title: 'Changelog',
        url: '/changelog',
        LinkComponent: Link,
      },

      github
        ? {
            icon: <IssuesCloseOutlined />,
            title: 'Issues',
            url: `${github}/issues`,
            openExternal: true,
          }
        : undefined,
    ].filter(Boolean) as FooterColumnItem[],
  };
  return [resources, community, help, more];
};
