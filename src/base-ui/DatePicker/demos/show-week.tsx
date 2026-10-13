import { Flexbox } from '@lobehub/ui';
import { DatePicker, DateRangePicker } from '@lobehub/ui/base-ui';

export default () => (
  <Flexbox gap={12} padding={16} style={{ maxWidth: 400 }}>
    <DatePicker showWeek />
    <DateRangePicker showWeek />
    <DatePicker picker="week" showWeek={false} />
  </Flexbox>
);
