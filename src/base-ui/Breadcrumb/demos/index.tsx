import { Flexbox } from '@lobehub/ui';
import { Breadcrumb } from '@lobehub/ui/base-ui';

export default () => {
  return (
    <Flexbox gap={16} padding={16}>
      <Breadcrumb items={[{ href: '#', title: 'Writing assistant' }, { title: 'Usage & cost' }]} />
      <Breadcrumb
        style={{ fontSize: 12 }}
        items={[
          { href: '#', title: 'Home' },
          { href: '#', title: 'Evals' },
          { href: '#', title: 'Agent Bench v3' },
          { title: 'Case #1042' },
        ]}
      />
      <Breadcrumb items={[{ title: 'Docs' }, { title: 'Guides' }]} separator="/" />
    </Flexbox>
  );
};
