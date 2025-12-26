import { CheckboxGroup } from '@lobehub/ui';
import { useState } from 'react';

import { Center } from '@/Flex';

export default () => {
  const [value, setValue] = useState<string[]>(['option1']);

  return (
    <Center gap={24}>
      <div>
        <h3>All Disabled</h3>
        <CheckboxGroup
          disabled
          onChange={(values) => setValue(values)}
          options={['option1', 'option2', 'option3']}
          value={value}
        />
      </div>
      <div>
        <h3>Partially Disabled</h3>
        <CheckboxGroup
          onChange={(values) => {
            setValue(values);
            console.log('Selected:', values);
          }}
          options={[
            { label: 'Enabled Option 1', value: 'option1' },
            { disabled: true, label: 'Disabled Option 2', value: 'option2' },
            { label: 'Enabled Option 3', value: 'option3' },
            { disabled: true, label: 'Disabled Option 4', value: 'option4' },
          ]}
          value={value}
        />
      </div>
    </Center>
  );
};
