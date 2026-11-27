import { DatePicker } from '@lobehub/ui';

// Sample data from the A2UI playground `DatePicker` (CopilotKit a2ui-playground, MIT).
export default () => (
  <DatePicker
    defaultValue={new Date(2026, 10, 12)}
    label="Launch date"
    placeholder="Pick a date"
    variant="a2ui"
  />
);
