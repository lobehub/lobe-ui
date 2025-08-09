import { Collapse } from '@lobehub/ui';
import { Flexbox } from 'react-layout-kit';

import { items } from './data';

export default () => {
  return (
    <Flexbox gap={32} width={'100%'}>
      <Collapse activeKey={['1', '2', '3']} items={items} padding={8} />
      <Collapse activeKey={['1', '2', '3']} items={items} padding={{ body: 0 }} />
      <Collapse
        activeKey={['1', '2', '3']}
        items={items}
        padding={{ body: 24, header: '16px 24px' }}
      />
    </Flexbox>
  );
};
