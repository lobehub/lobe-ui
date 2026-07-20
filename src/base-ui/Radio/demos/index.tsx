import { Flexbox } from '@lobehub/ui';
import { RadioGroup } from '@lobehub/ui/base-ui';
import { useState } from 'react';

export default () => {
  const [fruit, setFruit] = useState('apple');

  return (
    <Flexbox gap={16} padding={16}>
      <RadioGroup options={['apple', 'banana', 'cherry']} value={fruit} onChange={setFruit} />
      <RadioGroup
        defaultValue={'medium'}
        horizontal={false}
        options={[
          { label: 'Small', value: 'small' },
          { label: 'Medium', value: 'medium' },
          { label: 'Large (disabled)', disabled: true, value: 'large' },
        ]}
      />
      <RadioGroup defaultValue={'20px'} options={['20px']} size={20} />
      <RadioGroup disabled defaultValue={'all'} options={['all', 'disabled']} />
    </Flexbox>
  );
};
