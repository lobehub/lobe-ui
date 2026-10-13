import { Flexbox } from '@lobehub/ui';
import { DatePicker, DateRangePicker } from '@lobehub/ui/base-ui';

export default () => (
  <Flexbox gap={12} padding={16} style={{ maxWidth: 360 }}>
    <DatePicker status="error" />
    <DatePicker status="warning" />
    <DateRangePicker status="error" />
    <DateRangePicker status="warning" />
  </Flexbox>
);
