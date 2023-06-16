import { TabsNav } from '@lobehub/ui';

export default () => {
  return (
    <TabsNav
      items={[
        {
          key: 'home',
          label: 'Home',
        },
        {
          key: 'components',
          label: 'Components',
        },
        {
          key: 'changelog',
          label: 'Changelog',
        },
      ]}
    />
  );
};
