import { Flexbox } from '@lobehub/ui';
import { AutoComplete } from '@lobehub/ui/base-ui';
import { useState } from 'react';

const models = [
  'claude-fable-5',
  'claude-opus-4-8',
  'claude-sonnet-5',
  'claude-haiku-4-5',
  'gpt-5.2',
  'gemini-3-pro',
];

export default () => {
  const [value, setValue] = useState('');

  return (
    <Flexbox gap={16} padding={16} style={{ maxWidth: 480 }} width={'100%'}>
      <AutoComplete
        allowClear
        emptyText={'No matching model'}
        options={models}
        placeholder={'Search a model...'}
        value={value}
        onChange={setValue}
      />
      <AutoComplete
        placeholder={'Object options'}
        variant={'filled'}
        options={[
          { label: 'Production', value: 'prod' },
          { label: 'Staging', value: 'staging' },
          { disabled: true, label: 'Legacy (read-only)', value: 'legacy' },
        ]}
      />
    </Flexbox>
  );
};
