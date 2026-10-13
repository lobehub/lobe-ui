import { Flexbox } from '@lobehub/ui';
import { DatePicker, DateRangePicker } from '@lobehub/ui/base-ui';
import dayjs from 'dayjs';

const dateFormat = 'YYYY-MM-DD';

export default () => (
  <Flexbox gap={12} padding={16} style={{ maxWidth: 400 }}>
    <DatePicker disabled defaultValue={dayjs('2015-06-06', dateFormat)} />
    <DatePicker disabled defaultValue={dayjs('2015-06', 'YYYY-MM')} picker="month" />
    <DateRangePicker
      disabled
      defaultValue={[dayjs('2015-06-06', dateFormat), dayjs('2015-06-06', dateFormat)]}
    />
    {/* Only the end is disabled: the start stays editable. */}
    <DateRangePicker
      defaultValue={[dayjs('2019-09-03', dateFormat), dayjs('2019-11-22', dateFormat)]}
      disabled={[false, true]}
    />
    <DatePicker
      defaultValue={dayjs('2019-09-03', dateFormat)}
      maxDate={dayjs('2020-10-10', dateFormat)}
      minDate={dayjs('2019-06-01', dateFormat)}
    />
  </Flexbox>
);
