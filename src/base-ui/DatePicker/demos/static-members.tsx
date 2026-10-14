import { Flexbox } from '@lobehub/ui';
import { DatePicker, DateRangePicker, Text } from '@lobehub/ui/base-ui';
import { useState } from 'react';

// antd's static members: each preset picker fixes `picker`; `DateRangePicker` is the same
// component as `DatePicker.RangePicker`.
const { RangePicker, WeekPicker, MonthPicker, QuarterPicker, YearPicker, TimePicker } = DatePicker;

export default () => {
  const [last, setLast] = useState<string | null>(null);
  const onChange = (_date: unknown, dateString: string | string[] | null) =>
    setLast(Array.isArray(dateString) ? dateString.join(' ~ ') : dateString);

  return (
    <Flexbox gap={12} padding={16} style={{ maxWidth: 320 }}>
      <WeekPicker onChange={onChange} />
      <MonthPicker onChange={onChange} />
      <QuarterPicker onChange={onChange} />
      <YearPicker onChange={onChange} />
      <TimePicker onChange={onChange} />
      <RangePicker onChange={(_dates, dateStrings) => onChange(null, dateStrings)} />
      <RangePicker picker="month" onChange={(_dates, dateStrings) => onChange(null, dateStrings)} />
      <Text type="secondary">
        DateRangePicker === DatePicker.RangePicker: {String(DateRangePicker === RangePicker)}
      </Text>
      <Text type="secondary">dateString: {last === null ? 'null' : `"${last}"`}</Text>
    </Flexbox>
  );
};
