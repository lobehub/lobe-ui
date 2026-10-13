import { Flexbox } from '@lobehub/ui';
import { DatePicker, DateRangePicker } from '@lobehub/ui/base-ui';
import dayjs from 'dayjs';

const value = dayjs('2026-10-15');
const range: [dayjs.Dayjs, dayjs.Dayjs] = [dayjs('2026-10-15'), dayjs('2026-10-22')];

export default () => (
  <Flexbox gap={12} padding={16} style={{ maxWidth: 360 }}>
    <DatePicker defaultValue={value} variant="filled" />
    <DatePicker disabled defaultValue={value} variant="filled" />
    <DatePicker defaultValue={value} status="error" variant="filled" />
    <DatePicker defaultValue={value} status="warning" variant="filled" />
    <DateRangePicker defaultValue={range} variant="filled" />
    <DateRangePicker disabled defaultValue={range} variant="filled" />
    <DateRangePicker defaultValue={range} status="error" variant="filled" />
    <DatePicker picker="month" status="warning" variant="filled" />
    <DatePicker
      picker="year"
      placeholder="previewValue={false}"
      previewValue={false}
      variant="filled"
    />
    <DatePicker showTime placeholder="showTime, previewValue (hover)" variant="filled" />
    <DateRangePicker previewValue={false} variant="filled" />
  </Flexbox>
);
