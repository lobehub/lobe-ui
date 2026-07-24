import { Flexbox } from '@lobehub/ui';
import { Switch } from '@lobehub/ui/base-ui';
import { useState } from 'react';

export default () => {
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (value: boolean) => {
    setLoading(true);
    setTimeout(() => {
      setChecked(value);
      setLoading(false);
    }, 1500);
  };

  return (
    <Flexbox horizontal align="center" gap={8}>
      <span>Async:</span>
      <Switch checked={checked} loading={loading} onChange={handleChange} />
    </Flexbox>
  );
};
