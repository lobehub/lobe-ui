import { Checkbox } from '@lobehub/ui';
import { useState } from 'react';

import { Center } from '@/Flex';

export default () => {
  const [value, setValue] = useState<string[]>(['option1']);

  return (
    <Center gap={24}>
      <div>
        <h3>Using Checkbox.Group</h3>
        <Checkbox.Group
          options={['option1', 'option2', 'option3']}
          value={value}
          onChange={(values) => {
            setValue(values);
            console.log('Selected:', values);
          }}
        />
      </div>
      <div>
        <h3>Using CheckboxGroup directly</h3>
        <Checkbox.Group
          value={value}
          options={[
            { label: 'Apple', value: 'apple' },
            { label: 'Banana', value: 'banana' },
            { label: 'Orange', value: 'orange' },
          ]}
          onChange={(values) => {
            setValue(values);
            console.log('Selected:', values);
          }}
        />
      </div>
    </Center>
  );
};
