import { Flexbox, Text } from '@lobehub/ui';
import { Select } from '@lobehub/ui/base-ui';
import { BotIcon, TerminalIcon } from 'lucide-react';
import { useState } from 'react';

const options = [
  {
    label: (
      <Flexbox horizontal align="center" gap={8}>
        <BotIcon size={16} />
        Lobe AI
      </Flexbox>
    ),
    title: 'Lobe AI',
    value: 'agent_7f13b6',
  },
  {
    label: (
      <Flexbox horizontal align="center" gap={8}>
        <TerminalIcon size={16} />
        Claude Code
      </Flexbox>
    ),
    title: 'Claude Code',
    value: 'agent_91ac42',
  },
];

export default () => {
  const [value, setValue] = useState<string>();

  return (
    <Flexbox gap={12}>
      <Text>
        Open the Select and search for “Claude”. The Claude Code option must remain visible.
      </Text>
      <Select
        showSearch
        options={options}
        placeholder="Search agents"
        style={{ width: '100%' }}
        value={value}
        onChange={(nextValue) => setValue(nextValue as string | undefined)}
      />
      <Text code>Selected opaque value: {value ?? 'undefined'}</Text>
    </Flexbox>
  );
};
