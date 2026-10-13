import { Flexbox } from '@lobehub/ui';
import { DatePicker, DateRangePicker, type PickerSize, Segmented } from '@lobehub/ui/base-ui';
import { useState } from 'react';

export default () => {
  const [size, setSize] = useState<PickerSize>('medium');

  return (
    <Flexbox gap={12} padding={16} style={{ maxWidth: 360 }}>
      <Segmented
        options={['large', 'medium', 'small']}
        value={size}
        onChange={(value) => setSize(value as PickerSize)}
      />
      <DatePicker size={size} />
      <DatePicker picker="month" size={size} />
      <DateRangePicker size={size} />
      <DatePicker picker="year" size={size} />
      {/* `middle` is an alias of `medium`. */}
      <DatePicker placeholder='size="middle"' size="middle" />
    </Flexbox>
  );
};
