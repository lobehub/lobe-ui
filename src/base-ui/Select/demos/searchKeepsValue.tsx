import { Flexbox, Text } from '@lobehub/ui';
import { Select } from '@lobehub/ui/base-ui';
import { useState } from 'react';

const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Durian', value: 'durian' },
];

type Mode = 'single' | 'multiple' | 'tags';

const Case = ({ initial, mode, title }: { initial: string[]; mode: Mode; title: string }) => {
  const [value, setValue] = useState<string | string[] | undefined>(
    mode === 'single' ? initial[0] : initial,
  );
  const [count, setCount] = useState(0);

  return (
    <Flexbox gap={8}>
      <Text strong>{title}</Text>
      <Select
        showSearch
        mode={mode === 'single' ? undefined : mode}
        options={options}
        placeholder="Type a keyword that matches nothing, e.g. zzz"
        style={{ width: '100%' }}
        value={value}
        onChange={(next) => {
          setValue(next as string | string[] | undefined);
          setCount((c) => c + 1);
        }}
      />
      <Text code>Current value: {JSON.stringify(value)}</Text>
      <Text code>onChange count: {count}</Text>
    </Flexbox>
  );
};

export default () => (
  <Flexbox gap={24}>
    <Text type="secondary">
      Type a search term that does not match the selected option, then close the popup. The value
      must stay unchanged and the onChange count must stay at 0.
    </Text>
    <Case initial={['banana']} mode="single" title="Single" />
    <Case initial={['apple', 'cherry']} mode="multiple" title="Multiple" />
    <Case initial={['apple', 'cherry']} mode="tags" title="Tags" />
  </Flexbox>
);
