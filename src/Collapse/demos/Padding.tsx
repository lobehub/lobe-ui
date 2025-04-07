import { Collapse } from '@lobehub/ui';
import { Flexbox } from 'react-layout-kit';

import { items } from './data';

export default () => {
  return (
    <Flexbox gap={32}>
      <Collapse items={items} padding={8} />
      <Collapse items={items} padding={{ body: 0 }} />
      <Collapse items={items} padding={{ body: 24, header: '16px 24px' }} />
    </Flexbox>
  );
};
