import {
  DayjsDatePicker as DatePicker,
  type DayjsDatePickerProps as DatePickerProps,
  DayjsDateRangePicker as DateRangePicker,
  type DayjsDateRangePickerProps as DateRangePickerProps,
  Flexbox,
  Text,
} from '@lobehub/ui';
import { useState } from 'react';

export default () => {
  const [log, setLog] = useState('—');

  const onChange: DatePickerProps['onChange'] = (_date, dateString) =>
    setLog(`onChange: ${JSON.stringify(dateString)}`);
  const onOk: DatePickerProps['onOk'] = (date) => setLog(`onOk: ${date?.format() ?? 'null'}`);
  const onRangeChange: DateRangePickerProps['onChange'] = (_dates, dateStrings) =>
    setLog(`onChange: ${JSON.stringify(dateStrings)}`);
  const onRangeOk: DateRangePickerProps['onOk'] = (dates) =>
    setLog(`onOk: ${JSON.stringify(dates.map((date) => date?.format() ?? null))}`);

  return (
    <Flexbox gap={12} padding={16} style={{ maxWidth: 400 }}>
      <DatePicker showTime onChange={onChange} onOk={onOk} />
      <DatePicker
        format="YYYY-MM-DD HH:mm"
        showTime={{ format: 'HH:mm' }}
        onChange={onChange}
        onOk={onOk}
      />
      <DateRangePicker
        format="YYYY-MM-DD HH:mm"
        showTime={{ format: 'HH:mm' }}
        onChange={onRangeChange}
        onOk={onRangeOk}
      />
      <DatePicker picker="time" onChange={onChange} />
      <DatePicker use12Hours format="h:mm a" picker="time" onChange={onChange} />
      <DatePicker
        format="HH:mm:ss"
        picker="time"
        placeholder="hourStep 2 · minuteStep 15 · secondStep 10"
        showTime={{ hourStep: 2, minuteStep: 15, secondStep: 10 }}
        onChange={onChange}
      />
      <DatePicker
        picker="time"
        placeholder="changeOnScroll"
        showTime={{ changeOnScroll: true }}
        onChange={onChange}
      />
      <DateRangePicker picker="time" onChange={onRangeChange} />
      <Text type="secondary">{log}</Text>
    </Flexbox>
  );
};
