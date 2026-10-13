import { Flexbox } from '@lobehub/ui';
import { DatePicker, DateRangePicker } from '@lobehub/ui/base-ui';
import dayjs from 'dayjs';

const minDate = dayjs('2019-08-01');
const maxDate = dayjs('2020-10-31');

export default () => (
  <Flexbox gap={12} padding={16} style={{ maxWidth: 360 }}>
    <DatePicker defaultValue={dayjs('2019-09-03')} maxDate={maxDate} minDate={minDate} />
    <DateRangePicker
      defaultValue={[dayjs('2019-09-03'), dayjs('2019-11-22')]}
      maxDate={maxDate}
      minDate={minDate}
    />
  </Flexbox>
);
