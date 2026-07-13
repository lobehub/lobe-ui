import { Flexbox, Text } from '@lobehub/ui';
import { Select } from '@lobehub/ui/base-ui';
import { useState } from 'react';

const options = [
  { label: 'US East', value: 'us-east-1' },
  { label: 'US West', value: 'us-west-2' },
];

export default () => {
  const [latestValue, setLatestValue] = useState<string | undefined>('us-west-2');
  const [value, setValue] = useState<string | undefined>('us-west-2');

  return (
    <Flexbox gap={12}>
      <Text>Select a region, then clear it. The callback value must become undefined.</Text>
      <Select
        allowClear
        options={options}
        placeholder="Select a region"
        style={{ width: '100%' }}
        value={value}
        onChange={(nextValue) => {
          setValue(nextValue as string | undefined);
          setLatestValue(nextValue as string | undefined);
        }}
      />
      <Text code>Latest onChange value: {String(latestValue)}</Text>
    </Flexbox>
  );
};
