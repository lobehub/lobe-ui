import {
  DayjsDateRangePicker as DateRangePicker,
  type DayjsDateRangePickerProps as DateRangePickerProps,
  type DayjsDateRangeValue as DateRangeValue,
  Flexbox,
  Text,
} from '@lobehub/ui';
import { useState } from 'react';

export default () => {
  const [last, setLast] = useState<[string, string] | null>(null);
  const [event, setEvent] = useState('—');
  const [range, setRange] = useState<DateRangeValue | null>(null);

  const onChange: DateRangePickerProps['onChange'] = (_dates, dateStrings) => setLast(dateStrings);

  return (
    <Flexbox gap={12} padding={16} style={{ maxWidth: 400 }}>
      <DateRangePicker
        id={{ end: 'range-picker-end', start: 'range-picker-start' }}
        value={range}
        onBlur={(_event, info) => setEvent(`blur ${info.range}`)}
        onFocus={(_event, info) => setEvent(`focus ${info.range}`)}
        onCalendarChange={(_dates, dateStrings, info) =>
          setEvent(`calendarChange ${info.range}: ${JSON.stringify(dateStrings)}`)
        }
        onChange={(dates, dateStrings) => {
          setRange(dates);
          setLast(dateStrings);
        }}
      />
      <DateRangePicker showTime onChange={onChange} />
      <DateRangePicker picker="week" onChange={onChange} />
      <DateRangePicker picker="month" onChange={onChange} />
      <DateRangePicker picker="quarter" onChange={onChange} />
      <DateRangePicker picker="year" onChange={onChange} />
      <Text type="secondary">Last event (first picker): {event}</Text>
      <Text type="secondary">
        value (first picker):{' '}
        {range ? range.map((date) => date?.format('YYYY-MM-DD') ?? '–').join(' → ') : 'null'}
      </Text>
      <Text type="secondary">
        onChange dateStrings: {last === null ? 'null' : JSON.stringify(last)}
      </Text>
    </Flexbox>
  );
};
