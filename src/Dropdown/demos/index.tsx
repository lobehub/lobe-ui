import { Button, Dropdown } from '@lobehub/ui';

import { menu } from './data';

export default () => {
  return (
    <Dropdown menu={menu} trigger={['click']}>
      <Button type={'primary'}>Click</Button>
    </Dropdown>
  );
};
