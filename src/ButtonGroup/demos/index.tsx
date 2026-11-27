import { ButtonGroup } from '@lobehub/ui';
import { useState } from 'react';

export default () => {
  const [value, setValue] = useState('yearly');
  return (
    <ButtonGroup
      label="Billing period"
      value={value}
      options={[
        { label: 'Monthly', value: 'monthly' },
        { label: 'Quarterly', value: 'quarterly' },
        { label: 'Yearly', value: 'yearly' },
      ]}
      onChange={setValue}
    />
  );
};
