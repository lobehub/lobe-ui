import { DatePicker, type DatePickerProps, Flexbox, Segmented, Text } from '@lobehub/ui';
import { useState } from 'react';

type Placement = NonNullable<DatePickerProps['placement']>;

const placements: Placement[] = ['bottomLeft', 'bottomRight', 'topLeft', 'topRight'];

export default () => {
  const [placement, setPlacement] = useState<Placement>('bottomLeft');

  return (
    <Flexbox gap={16} padding={16} style={{ width: '100%' }}>
      <Segmented
        options={placements}
        value={placement}
        onChange={(value) => setPlacement(value as Placement)}
      />
      <Flexbox horizontal gap={8} justify="space-between" wrap="wrap">
        <DatePicker placement={placement} />
        <DatePicker.RangePicker placement={placement} />
        <DatePicker placement={placement} />
      </Flexbox>
      <Text type="secondary">
        The popup flips to the other side when there is no room (scroll this demo to the bottom of
        the window, or pick a top placement near the top) and shifts sideways to stay on screen (the
        picker at the right edge).
      </Text>
    </Flexbox>
  );
};
