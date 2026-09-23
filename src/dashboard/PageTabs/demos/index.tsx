import { PageTabs } from '@lobehub/ui/dashboard';
import { useState } from 'react';

export default () => {
  const [tab, setTab] = useState('overview');
  return (
    <PageTabs
      label="Resource sections"
      value={tab}
      tabs={[
        { content: 'Overview panel', count: 4, label: 'Overview', value: 'overview' },
        { content: 'Activity panel', label: 'Activity', value: 'activity' },
      ]}
      onChange={setTab}
    />
  );
};
