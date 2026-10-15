import { Flexbox } from '@lobehub/ui';
import {
  DayjsDatePicker as DatePicker,
  type DayjsDatePickerProps as DatePickerProps,
  Text,
} from '@lobehub/ui';
import { useState } from 'react';

export default () => {
  const [last, setLast] = useState<string | null>(null);

  const onChange: DatePickerProps['onChange'] = (_date, dateString) => setLast(dateString);

  return (
    <Flexbox gap={12} padding={16} style={{ maxWidth: 280 }}>
      <DatePicker onChange={onChange} />
      <DatePicker picker="week" onChange={onChange} />
      <DatePicker picker="month" onChange={onChange} />
      <DatePicker picker="quarter" onChange={onChange} />
      <DatePicker picker="year" onChange={onChange} />
      <Text type="secondary">Static members</Text>
      <DatePicker.WeekPicker onChange={onChange} />
      <DatePicker.MonthPicker onChange={onChange} />
      <DatePicker.QuarterPicker onChange={onChange} />
      <DatePicker.YearPicker onChange={onChange} />
      <Text type="secondary">onChange dateString: {last === null ? 'null' : `"${last}"`}</Text>
    </Flexbox>
  );
};
