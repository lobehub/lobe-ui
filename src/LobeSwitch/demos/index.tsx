import { Flexbox, LobeSwitch } from '@lobehub/ui';
import { CheckIcon, XIcon } from 'lucide-react';
import { useState } from 'react';

export default () => {
  const [checked, setChecked] = useState(false);

  return (
    <Flexbox gap={16}>
      <Flexbox horizontal align="center" gap={8}>
        <span>Default:</span>
        <LobeSwitch checked={checked} onChange={setChecked} />
      </Flexbox>
      <Flexbox horizontal align="center" gap={8}>
        <span>Small:</span>
        <LobeSwitch checked={checked} size="small" onChange={setChecked} />
      </Flexbox>
      <Flexbox horizontal align="center" gap={8}>
        <span>With Icons:</span>
        <LobeSwitch
          checked={checked}
          checkedChildren={<CheckIcon size={12} />}
          unCheckedChildren={<XIcon size={12} />}
          onChange={setChecked}
        />
      </Flexbox>
      <Flexbox horizontal align="center" gap={8}>
        <span>Disabled:</span>
        <LobeSwitch disabled />
      </Flexbox>
      <Flexbox horizontal align="center" gap={8}>
        <span>Disabled Checked:</span>
        <LobeSwitch defaultChecked disabled />
      </Flexbox>
      <Flexbox horizontal align="center" gap={8}>
        <span>Loading:</span>
        <LobeSwitch loading />
      </Flexbox>
      <Flexbox horizontal align="center" gap={8}>
        <span>Loading Small:</span>
        <LobeSwitch loading size="small" />
      </Flexbox>
    </Flexbox>
  );
};
