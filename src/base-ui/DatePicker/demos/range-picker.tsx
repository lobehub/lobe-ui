import { Flexbox } from '@lobehub/ui';
import { DateRangePicker, type DateRangePickerProps, Text } from '@lobehub/ui/base-ui';
import { useState } from 'react';

// `id` / `onFocus` `info.range` follow with the RangePicker work.
export default () => {
  const [last, setLast] = useState<[string, string] | null>(null);

  const onChange: DateRangePickerProps['onChange'] = (_dates, dateStrings) => setLast(dateStrings);

  return (
    <Flexbox gap={12} padding={16} style={{ maxWidth: 400 }}>
      <DateRangePicker onChange={onChange} />
      <DateRangePicker showTime onChange={onChange} />
      <DateRangePicker picker="week" onChange={onChange} />
      <DateRangePicker picker="month" onChange={onChange} />
      <DateRangePicker picker="quarter" onChange={onChange} />
      <DateRangePicker picker="year" onChange={onChange} />
      <Text type="secondary">
        onChange dateStrings: {last === null ? 'null' : JSON.stringify(last)}
      </Text>
    </Flexbox>
  );
};
