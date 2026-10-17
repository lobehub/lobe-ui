import { Flexbox } from '@lobehub/ui';
import { ToggleGroup, type ToggleGroupProps } from '@lobehub/ui';
import { useState } from 'react';

type Weekday = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

const options: ToggleGroupProps<Weekday>['options'] = [
  { label: 'Mon', value: 'mon' },
  { label: 'Tue', value: 'tue' },
  { label: 'Wed', value: 'wed' },
  { label: 'Thu', value: 'thu' },
  { label: 'Fri', value: 'fri' },
  { label: 'Sat', value: 'sat' },
  { label: 'Sun', value: 'sun' },
];

export default () => {
  const [days, setDays] = useState<Weekday[]>(['mon', 'tue', 'wed', 'thu', 'fri']);

  return (
    <Flexbox align="flex-start" gap={16} padding={16}>
      <ToggleGroup<Weekday>
        multiple
        options={options}
        value={days}
        onChange={(next) => setDays(next)}
      />
      <ToggleGroup<Weekday> multiple defaultValue={['wed', 'fri']} options={options} size="small" />
    </Flexbox>
  );
};
