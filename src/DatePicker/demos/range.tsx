import { Flexbox } from '@lobehub/ui';
import { DateRangePicker, type DateRangeValue } from '@lobehub/ui';
import { useState } from 'react';

export default () => {
  const [range, setRange] = useState<DateRangeValue>([null, null]);

  return (
    <Flexbox padding={16} style={{ maxWidth: 360 }}>
      <DateRangePicker value={range} onChange={setRange} />
    </Flexbox>
  );
};
