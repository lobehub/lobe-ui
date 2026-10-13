import { Flexbox } from '@lobehub/ui';
import { DateRangePicker, type DateRangeValue, Text } from '@lobehub/ui/base-ui';
import { useState } from 'react';

export default () => {
  const [range, setRange] = useState<DateRangeValue | null>(null);

  return (
    <Flexbox gap={12} padding={16} style={{ maxWidth: 360 }}>
      <DateRangePicker value={range} onChange={setRange} />
      <Text type="secondary">
        {range ? range.map((date) => date?.format('YYYY-MM-DD') ?? '–').join(' → ') : 'null'}
      </Text>
    </Flexbox>
  );
};
