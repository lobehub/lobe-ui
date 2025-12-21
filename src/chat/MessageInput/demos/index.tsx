import { MessageInput } from '@lobehub/ui/chat';
import { Divider } from 'antd';
import { useState } from 'react';

import { Flexbox } from '@/Flex';

export default () => {
  const [value, setValue] = useState('');
  return (
    <Flexbox width={'100%'}>
      <MessageInput
        defaultValue={'hello world'}
        height={200}
        onConfirm={setValue}
        style={{ width: '100%' }}
      />
      <Divider>Only change when click confirm</Divider>
      {value}
    </Flexbox>
  );
};
