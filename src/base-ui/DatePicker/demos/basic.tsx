import { Flexbox } from '@lobehub/ui';
import { DatePicker, type DatePickerProps, Text } from '@lobehub/ui/base-ui';
import { useState } from 'react';

export default () => {
  const [last, setLast] = useState<string | null>(null);

  const onChange: DatePickerProps['onChange'] = (_date, dateString) => setLast(dateString);

  return (
    <Flexbox gap={12} padding={16} style={{ maxWidth: 280 }}>
      <DatePicker onChange={onChange} />
      <DatePicker picker="month" onChange={onChange} />
      <DatePicker picker="year" onChange={onChange} />
      <Text type="secondary">onChange dateString: {last === null ? 'null' : `"${last}"`}</Text>
    </Flexbox>
  );
};
