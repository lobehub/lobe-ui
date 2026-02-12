import { Flexbox } from '@lobehub/ui';
import { Switch } from '@lobehub/ui/base-ui';
import { CheckIcon, XIcon } from 'lucide-react';
import { useState } from 'react';

export default () => {
  const [checked, setChecked] = useState(false);

  return (
    <Flexbox gap={16}>
      <Flexbox horizontal align="center" gap={8}>
        <span>Default:</span>
        <Switch checked={checked} onChange={setChecked} />
      </Flexbox>
      <Flexbox horizontal align="center" gap={8}>
        <span>Small:</span>
        <Switch checked={checked} size="small" onChange={setChecked} />
      </Flexbox>
      <Flexbox horizontal align="center" gap={8}>
        <span>With Icons:</span>
        <Switch
          checked={checked}
          checkedChildren={<CheckIcon size={12} />}
          unCheckedChildren={<XIcon size={12} />}
          onChange={setChecked}
        />
      </Flexbox>
      <Flexbox horizontal align="center" gap={8}>
        <span>Disabled:</span>
        <Switch disabled />
      </Flexbox>
      <Flexbox horizontal align="center" gap={8}>
        <span>Disabled Checked:</span>
        <Switch defaultChecked disabled />
      </Flexbox>
      <Flexbox horizontal align="center" gap={8}>
        <span>Loading:</span>
        <Switch loading />
      </Flexbox>
      <Flexbox horizontal align="center" gap={8}>
        <span>Loading Small:</span>
        <Switch loading size="small" />
      </Flexbox>
    </Flexbox>
  );
};
