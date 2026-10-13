import { Flexbox } from '@lobehub/ui';
import { DatePicker } from '@lobehub/ui/base-ui';
import type { Dayjs } from 'dayjs';
import { useState } from 'react';

export default () => {
  const [startValue, setStartValue] = useState<Dayjs | null>(null);
  const [endValue, setEndValue] = useState<Dayjs | null>(null);
  const [endOpen, setEndOpen] = useState(false);

  return (
    <Flexbox horizontal gap={12} padding={16} style={{ maxWidth: 560 }}>
      <DatePicker
        showTime
        disabledDate={(current) => !!endValue && current.isAfter(endValue, 'day')}
        format="YYYY-MM-DD HH:mm:ss"
        placeholder="Start"
        value={startValue}
        onChange={setStartValue}
        onOpenChange={(open) => {
          if (!open) setEndOpen(true);
        }}
      />
      <DatePicker
        showTime
        disabledDate={(current) => !!startValue && current.isBefore(startValue, 'day')}
        format="YYYY-MM-DD HH:mm:ss"
        open={endOpen}
        placeholder="End"
        value={endValue}
        onChange={setEndValue}
        onOpenChange={setEndOpen}
      />
    </Flexbox>
  );
};
