import { List, Tag } from '@lobehub/ui';

export default () => (
  <List
    marker="none"
    variant="a2ui"
    items={[
      {
        description: 'GitHub, GitLab or Bitbucket',
        key: 'connect',
        label: 'Connect your repository',
        marker: '1',
        value: 'Done',
      },
      {
        children: (
          <Tag color="info" size="small" variant="a2ui">
            Recommended
          </Tag>
        ),
        description: 'We detected Next.js',
        key: 'preset',
        label: 'Pick a framework preset',
        marker: '2',
      },
      {
        description: 'Available after step 2',
        disabled: true,
        key: 'deploy',
        label: 'Deploy the main branch',
        marker: '3',
      },
    ]}
  />
);
