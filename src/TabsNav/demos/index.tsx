import { TabsNav } from '@lobehub/ui';

export default () => {
  return (
    <TabsNav
      items={[
        {
          label: 'Home',
          key: 'home',
        },
        {
          label: 'Components',
          key: 'components',
        },
        {
          label: 'Changelog',
          key: 'changelog',
        },
      ]}
    />
  );
};
