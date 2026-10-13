import { Flexbox } from '@lobehub/ui';
import { DatePicker, type PickerMode, Select, Text } from '@lobehub/ui/base-ui';
import { useState } from 'react';

const pickers: PickerMode[] = ['date', 'week', 'month', 'quarter', 'year', 'time'];

export default () => {
  const [picker, setPicker] = useState<PickerMode>('date');
  const [last, setLast] = useState<string | null>(null);

  return (
    <Flexbox gap={12} padding={16} style={{ maxWidth: 420 }}>
      <Flexbox horizontal gap={8}>
        <Select
          options={pickers.map((value) => ({ label: value, value }))}
          style={{ width: 120 }}
          value={picker}
          onChange={(value) => setPicker(value as PickerMode)}
        />
        <DatePicker picker={picker} onChange={(_date, dateString) => setLast(dateString)} />
      </Flexbox>
      <Text type="secondary">dateString: {last === null ? 'null' : `"${last}"`}</Text>
    </Flexbox>
  );
};
