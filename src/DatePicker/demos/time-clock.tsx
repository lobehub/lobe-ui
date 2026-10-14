import { DatePicker, type DatePickerProps, DateRangePicker, Flexbox, Text } from '@lobehub/ui';
import dayjs from 'dayjs';
import { useState } from 'react';

export default () => {
  const [log, setLog] = useState('—');
  const onChange: DatePickerProps['onChange'] = (_date, dateString) =>
    setLog(`onChange: ${JSON.stringify(dateString)}`);

  return (
    <Flexbox gap={12} padding={16} style={{ maxWidth: 400 }}>
      <DatePicker
        defaultValue={dayjs('2026-10-14 09:30')}
        format="HH:mm"
        picker="time"
        timePanel="clock"
        onChange={onChange}
      />
      <DatePicker picker="time" placeholder="HH:mm:ss · seconds stepper" timePanel="clock" />
      <DatePicker
        use12Hours
        format="h:mm a"
        picker="time"
        placeholder="h:mm a"
        timePanel="clock"
        onChange={onChange}
      />
      <DatePicker
        format="HH:mm"
        minuteStep={15}
        picker="time"
        placeholder="minuteStep 15 · no hours before 8"
        timePanel="clock"
        disabledTime={() => ({
          disabledHours: () => Array.from({ length: 8 }, (_, hour) => hour),
        })}
      />
      <DatePicker format="YYYY-MM-DD HH:mm" showTime={{ format: 'HH:mm', timePanel: 'clock' }} />
      <DateRangePicker format="HH:mm" picker="time" timePanel="clock" />
      <DateRangePicker
        format="YYYY-MM-DD HH:mm"
        showTime={{ format: 'HH:mm', timePanel: 'clock' }}
      />
      <Text type="secondary">{log}</Text>
    </Flexbox>
  );
};
