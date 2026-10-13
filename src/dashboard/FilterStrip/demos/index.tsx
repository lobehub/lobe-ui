import { FilterStrip } from '@lobehub/ui/dashboard';
import { useState } from 'react';

export default () => {
  const [value, setValue] = useState('all');
  return (
    <FilterStrip
      label="Filter by status"
      value={value}
      items={[
        { count: 12_345, key: 'all', label: 'All' },
        { count: 42, key: 'failed', label: 'Failed', tone: 'danger' },
        { count: 0, key: 'retrying', label: 'Retrying', tone: 'warning' },
        { key: 'archived', label: 'Archived' },
      ]}
      onChange={setValue}
    />
  );
};
