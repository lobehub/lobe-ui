import { ChipSelect } from '@lobehub/ui';
import { useState } from 'react';

export default () => {
  const [value, setValue] = useState(['deploys', 'incidents']);
  return (
    <ChipSelect
      label="Notify me about"
      value={value}
      options={[
        { label: 'Deploys', value: 'deploys' },
        { label: 'Incidents', value: 'incidents' },
        { label: 'Billing', value: 'billing' },
        { label: 'Security', value: 'security' },
        { label: 'Usage spikes', value: 'usage' },
      ]}
      onChange={setValue}
    />
  );
};
