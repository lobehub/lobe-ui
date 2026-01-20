import { Flexbox, LobeSwitch } from '@lobehub/ui';
import { CheckIcon, XIcon } from 'lucide-react';
import { useState } from 'react';

export default () => {
  const [checked, setChecked] = useState(false);

  return (
    <Flexbox gap={16}>
      <Flexbox align="center" gap={8} horizontal>
        <span>Default:</span>
        <LobeSwitch checked={checked} onChange={setChecked} />
      </Flexbox>
      <Flexbox align="center" gap={8} horizontal>
        <span>Small:</span>
        <LobeSwitch checked={checked} onChange={setChecked} size="small" />
      </Flexbox>
      <Flexbox align="center" gap={8} horizontal>
        <span>With Icons:</span>
        <LobeSwitch
          checked={checked}
          checkedChildren={<CheckIcon size={12} />}
          onChange={setChecked}
          unCheckedChildren={<XIcon size={12} />}
        />
      </Flexbox>
      <Flexbox align="center" gap={8} horizontal>
        <span>Disabled:</span>
        <LobeSwitch disabled />
      </Flexbox>
      <Flexbox align="center" gap={8} horizontal>
        <span>Disabled Checked:</span>
        <LobeSwitch defaultChecked disabled />
      </Flexbox>
      <Flexbox align="center" gap={8} horizontal>
        <span>Loading:</span>
        <LobeSwitch loading />
      </Flexbox>
      <Flexbox align="center" gap={8} horizontal>
        <span>Loading Small:</span>
        <LobeSwitch loading size="small" />
      </Flexbox>
    </Flexbox>
  );
};
