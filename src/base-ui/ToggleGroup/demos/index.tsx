import { Flexbox } from '@lobehub/ui';
import { ToggleGroup, type ToggleGroupProps } from '@lobehub/ui/base-ui';
import { CodeIcon, EyeIcon } from 'lucide-react';
import { useState } from 'react';

const options: ToggleGroupProps<'preview' | 'source'>['options'] = [
  { icon: <EyeIcon size={14} />, label: 'Preview', value: 'preview' },
  { icon: <CodeIcon size={14} />, label: 'Source', value: 'source' },
];

export default () => {
  const [mode, setMode] = useState<'preview' | 'source'>('preview');

  return (
    <Flexbox align="flex-start" gap={16} padding={16}>
      <ToggleGroup options={options} value={mode} onChange={setMode} />
      <ToggleGroup defaultValue="preview" options={options} size="small" />
      <ToggleGroup defaultValue="preview" options={options} variant="borderless" />
      <ToggleGroup
        defaultValue="b"
        options={[
          { label: 'Alpha', value: 'a' },
          { disabled: true, label: 'Beta', value: 'b' },
          { label: 'Gamma', value: 'gamma' },
        ]}
      />
    </Flexbox>
  );
};
