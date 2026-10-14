import { DateRangePicker, Flexbox, Text } from '@lobehub/ui';
import { useState } from 'react';

export default () => {
  const [value, setValue] = useState<[string, string] | null>(null);

  return (
    <Flexbox gap={12} padding={16} style={{ maxWidth: 400 }}>
      {/* The end may stay empty: pick a start, then press Tab or click outside. */}
      <DateRangePicker
        allowEmpty={[false, true]}
        placeholder={['Start date', 'Till Now']}
        onChange={(_dates, dateStrings) => setValue(dateStrings)}
      />
      <Text type="secondary">
        onChange dateStrings: {value === null ? 'null' : JSON.stringify(value)}
      </Text>
    </Flexbox>
  );
};
