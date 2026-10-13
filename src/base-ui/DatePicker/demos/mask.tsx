import { Flexbox } from '@lobehub/ui';
import { DatePicker, type DatePickerProps, DateRangePicker, Text } from '@lobehub/ui/base-ui';
import { useState } from 'react';

export default () => {
  const [last, setLast] = useState<string | null>(null);

  const onChange: DatePickerProps['onChange'] = (_date, dateString) => setLast(dateString);

  return (
    <Flexbox gap={12} padding={16} style={{ maxWidth: 320 }}>
      <DatePicker format={{ format: 'YYYY-MM-DD', type: 'mask' }} onChange={onChange} />
      <DatePicker format={{ format: 'DD/MM/YYYY', type: 'mask' }} onChange={onChange} />
      <DatePicker format={{ format: 'YYYY-MM', type: 'mask' }} picker="month" onChange={onChange} />
      <DatePicker
        showTime
        format={{ format: 'YYYY-MM-DD HH:mm:ss', type: 'mask' }}
        onChange={onChange}
      />
      <DatePicker format={{ format: 'HH:mm', type: 'mask' }} picker="time" onChange={onChange} />
      <DateRangePicker format={{ format: 'YYYY-MM-DD', type: 'mask' }} />
      <Text type="secondary">onChange dateString: {last === null ? 'null' : `"${last}"`}</Text>
    </Flexbox>
  );
};
