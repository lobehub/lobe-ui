import { Flexbox } from '@lobehub/ui';
import {
  DatePicker,
  datePickerLocaleEnUS,
  type DatePickerProps,
  DateRangePicker,
  type PickerLocale,
  Text,
} from '@lobehub/ui/base-ui';
import dayjs from 'dayjs';
import buddhistEra from 'dayjs/plugin/buddhistEra';
import { useState } from 'react';

dayjs.extend(buddhistEra);

// `BBBB` is the Buddhist-era year from the dayjs `buddhistEra` plugin.
const buddhistLocale: PickerLocale = {
  ...datePickerLocaleEnUS,
  lang: {
    ...datePickerLocaleEnUS.lang,
    cellYearFormat: 'BBBB',
    fieldDateFormat: 'BBBB-MM-DD',
    fieldDateTimeFormat: 'BBBB-MM-DD HH:mm:ss',
    yearFormat: 'BBBB',
  },
};

const defaultValue = dayjs('2024-01-01');

// lobe has no ConfigProvider `locale.DatePicker`: share the locale through a wrapper instead.
const BuddhistDatePicker = (props: DatePickerProps) => (
  <DatePicker locale={buddhistLocale} {...props} />
);

export default () => {
  const [log, setLog] = useState('—');

  const onChange: DatePickerProps['onChange'] = (date, dateString) =>
    setLog(`${dateString} (Gregorian ${date?.format('YYYY-MM-DD HH:mm:ss') ?? 'null'})`);

  return (
    <Flexbox gap={12} padding={16} style={{ maxWidth: 420 }}>
      <Text strong>By locale prop</Text>
      <DatePicker defaultValue={defaultValue} locale={buddhistLocale} onChange={onChange} />
      <DatePicker
        showTime
        defaultValue={defaultValue}
        locale={buddhistLocale}
        onChange={onChange}
      />
      <Text strong>Shared by a wrapper component</Text>
      <BuddhistDatePicker defaultValue={defaultValue} onChange={onChange} />
      <BuddhistDatePicker showTime defaultValue={defaultValue} onChange={onChange} />
      <DateRangePicker
        defaultValue={[defaultValue, defaultValue.add(7, 'day')]}
        locale={buddhistLocale}
      />
      <Text type="secondary">onChange: {log}</Text>
    </Flexbox>
  );
};
