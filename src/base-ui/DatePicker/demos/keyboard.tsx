import { Flexbox } from '@lobehub/ui';
import { DatePicker, DateRangePicker, Text } from '@lobehub/ui/base-ui';
import { useState } from 'react';

export default () => {
  const [last, setLast] = useState<string | null>(null);

  return (
    <Flexbox gap={12} padding={16} style={{ maxWidth: 400 }}>
      <DatePicker picker="month" onChange={(_date, dateString) => setLast(dateString)} />
      <DatePicker picker="quarter" onChange={(_date, dateString) => setLast(dateString)} />
      <DatePicker picker="year" onChange={(_date, dateString) => setLast(dateString)} />
      <DateRangePicker
        picker="month"
        onChange={(_dates, dateStrings) => setLast(dateStrings?.join(' ~ ') ?? null)}
      />
      <Text type="secondary">
        Open a picker, then use ←/→/↑/↓, PageUp/PageDown, Home/End and Enter. Last value:{' '}
        {last === null ? 'null' : `"${last}"`}
      </Text>
    </Flexbox>
  );
};
