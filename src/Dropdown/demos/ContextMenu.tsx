import { Dropdown } from '@lobehub/ui';

import { Flexbox } from '@/Flex';

import { menu } from './data';

export default () => {
  return (
    <Dropdown menu={menu} trigger={['contextMenu']}>
      <Flexbox
        align={'center'}
        justify={'center'}
        style={{ height: '100%', minHeight: 200, width: '100%' }}
      >
        RightClick
      </Flexbox>
    </Dropdown>
  );
};
