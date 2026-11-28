import { Combobox } from '@lobehub/ui';

// Sample data from the A2UI playground `Combobox` (CopilotKit a2ui-playground, MIT).
export default () => (
  <Combobox
    defaultValue="Asia/Kolkata"
    label="Timezone"
    placeholder="Search timezones"
    variant="a2ui"
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
  />
);
