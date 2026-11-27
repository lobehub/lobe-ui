import { Combobox } from '@lobehub/ui';
import { useState } from 'react';

export default () => {
  const [value, setValue] = useState('Asia/Kolkata');
  return (
    <Combobox
      label="Timezone"
      placeholder="Search timezones"
      value={value}
      options={[
        { label: 'Pacific Time, Los Angeles', value: 'America/Los_Angeles' },
        { label: 'Mountain Time, Denver', value: 'America/Denver' },
        { label: 'Central Time, Chicago', value: 'America/Chicago' },
        { label: 'Eastern Time, New York', value: 'America/New_York' },
        { label: 'London', value: 'Europe/London' },
        { label: 'Berlin', value: 'Europe/Berlin' },
        { label: 'India Standard Time, Kolkata', value: 'Asia/Kolkata' },
        { label: 'Tokyo', value: 'Asia/Tokyo' },
        { label: 'Sydney', value: 'Australia/Sydney' },
      ]}
      onChange={setValue}
    />
  );
};
