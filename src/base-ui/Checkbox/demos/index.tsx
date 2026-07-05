import { Flexbox } from '@lobehub/ui';
import { Checkbox, CheckboxGroup } from '@lobehub/ui/base-ui';
import { useState } from 'react';

export default () => {
  const [fruits, setFruits] = useState<string[]>(['apple']);

  return (
    <Flexbox gap={16} padding={16}>
      <Checkbox defaultChecked>Default checked</Checkbox>
      <Checkbox indeterminate>Indeterminate</Checkbox>
      <Checkbox shape={'circle'}>Circle shape</Checkbox>
      <Checkbox defaultChecked backgroundColor={'#f59e0b'}>
        Custom color
      </Checkbox>
      <Checkbox defaultChecked disabled>
        Disabled
      </Checkbox>
      <Checkbox size={20}>Bigger box</Checkbox>
      <CheckboxGroup options={['apple', 'banana', 'cherry']} value={fruits} onChange={setFruits} />
    </Flexbox>
  );
};
