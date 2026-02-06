import { CheckboxGroup } from '@lobehub/ui';
import { useState } from 'react';

import { Center } from '@/Flex';

export default () => {
  const [value, setValue] = useState<string[]>(['apple']);

  return (
    <Center gap={16}>
      <CheckboxGroup
        value={value}
        options={[
          { label: 'Apple', value: 'apple' },
          { label: 'Banana', value: 'banana' },
          { label: 'Orange', value: 'orange' },
          { label: 'Grape', value: 'grape' },
        ]}
        onChange={(values) => {
          setValue(values);
          console.log('Selected:', values);
        }}
      />
    </Center>
  );
};
