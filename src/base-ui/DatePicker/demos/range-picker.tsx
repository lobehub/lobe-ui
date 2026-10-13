import { Flexbox } from '@lobehub/ui';
import { DateRangePicker, type DateRangePickerProps, Text } from '@lobehub/ui/base-ui';
import { useState } from 'react';

export default () => {
  const [last, setLast] = useState<[string, string] | null>(null);
  const [event, setEvent] = useState('—');

  const onChange: DateRangePickerProps['onChange'] = (_dates, dateStrings) => setLast(dateStrings);

  return (
    <Flexbox gap={12} padding={16} style={{ maxWidth: 400 }}>
      <DateRangePicker
        id={{ end: 'range-picker-end', start: 'range-picker-start' }}
        onBlur={(_event, info) => setEvent(`blur ${info.range}`)}
        onChange={onChange}
        onFocus={(_event, info) => setEvent(`focus ${info.range}`)}
        onCalendarChange={(_dates, dateStrings, info) =>
          setEvent(`calendarChange ${info.range}: ${JSON.stringify(dateStrings)}`)
        }
      />
      <DateRangePicker showTime onChange={onChange} />
      <DateRangePicker picker="week" onChange={onChange} />
      <DateRangePicker picker="month" onChange={onChange} />
      <DateRangePicker picker="quarter" onChange={onChange} />
      <DateRangePicker picker="year" onChange={onChange} />
      <Text type="secondary">Last event (first picker): {event}</Text>
      <Text type="secondary">
        onChange dateStrings: {last === null ? 'null' : JSON.stringify(last)}
      </Text>
    </Flexbox>
  );
};
