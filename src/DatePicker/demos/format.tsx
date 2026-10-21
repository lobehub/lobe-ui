import {
  DayjsDatePicker as DatePicker,
  type DayjsDatePickerProps as DatePickerProps,
  DayjsDateRangePicker as DateRangePicker,
  Flexbox,
  Text,
} from '@lobehub/ui';
import dayjs, { type Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useState } from 'react';

// Needed to build values from strings in a custom format, e.g. dayjs('2015/01/01', 'YYYY/MM/DD').
dayjs.extend(customParseFormat);

const dateFormat = 'YYYY/MM/DD';
const weekFormat = 'MM/DD';
const monthFormat = 'YYYY/MM';

/** The first format is used for display; every string format is tried when parsing input. */
const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY', 'DD-MM-YYYY', 'DD-MM-YY'];

const customFormat = (value: Dayjs) => `custom format: ${value.format(dateFormat)}`;

const customWeekStartEndFormat = (value: Dayjs) =>
  `${value.startOf('week').format(weekFormat)} ~ ${value.endOf('week').format(weekFormat)}`;

export default () => {
  const [last, setLast] = useState<string | null>(null);

  const onChange: DatePickerProps['onChange'] = (_date, dateString) => setLast(dateString);

  return (
    <Flexbox gap={12} padding={16} style={{ maxWidth: 320 }}>
      <DatePicker
        defaultValue={dayjs('2015/01/01', dateFormat)}
        format={dateFormat}
        onChange={onChange}
      />
      <DatePicker
        defaultValue={dayjs('01/01/2015', dateFormatList[0])}
        format={dateFormatList}
        onChange={onChange}
      />
      <DatePicker
        defaultValue={dayjs('2015/01', monthFormat)}
        format={monthFormat}
        picker="month"
        onChange={onChange}
      />
      <DatePicker
        defaultValue={dayjs()}
        format={customWeekStartEndFormat}
        picker="week"
        onChange={onChange}
      />
      <DateRangePicker
        defaultValue={[dayjs('2015/01/01', dateFormat), dayjs('2015/01/01', dateFormat)]}
        format={dateFormat}
      />
      <DatePicker
        defaultValue={dayjs('2015/01/01', dateFormat)}
        format={customFormat}
        onChange={onChange}
      />
      <Text type="secondary">onChange dateString: {last === null ? 'null' : `"${last}"`}</Text>
    </Flexbox>
  );
};
