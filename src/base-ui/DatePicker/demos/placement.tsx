import { Flexbox } from '@lobehub/ui';
import { DatePicker, DateRangePicker, type PickerPlacement, Segmented } from '@lobehub/ui/base-ui';
import { useState } from 'react';

export default () => {
  const [placement, setPlacement] = useState<PickerPlacement>('topLeft');

  // Room on every side, so the popup is not shifted back into the viewport.
  return (
    <Flexbox align="center" gap={12} padding={16} style={{ paddingBlock: 400 }}>
      <Segmented
        options={['topLeft', 'topRight', 'bottomLeft', 'bottomRight']}
        value={placement}
        onChange={(value) => setPlacement(value as PickerPlacement)}
      />
      <DatePicker placement={placement} style={{ width: 200 }} />
      <DateRangePicker placement={placement} style={{ width: 400 }} />
    </Flexbox>
  );
};
