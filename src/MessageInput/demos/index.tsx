import { MessageInput } from '@unitalkai/ui';
import { Divider } from 'antd';
import { useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import { content } from '@/Markdown/demos/data';

export default () => {
  const [value, setValue] = useState('');
  return (
    <Flexbox width={'100%'}>
      <MessageInput
        defaultValue={content}
        height={200}
        onConfirm={setValue}
        style={{ width: '100%' }}
      />
      <Divider>Only change when click confirm</Divider>
      {value}
    </Flexbox>
  );
};
