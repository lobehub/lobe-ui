import { Flexbox } from '@lobehub/ui';
import {
  DatePicker,
  type DatePickerProps,
  DateRangePicker,
  type PanelMode,
  Text,
} from '@lobehub/ui/base-ui';
import { useState } from 'react';

const ControlledDatePicker = () => {
  const [mode, setMode] = useState<PanelMode>('month');

  return (
    <Flexbox gap={4}>
      <DatePicker mode={mode} onPanelChange={(_, next) => setMode(next)} />
      <Text type="secondary">mode: {mode}</Text>
    </Flexbox>
  );
};

// Starts on the time panel every time it opens; the header of the date panel still drills up.
const ControlledTimeMode = () => {
  const [mode, setMode] = useState<PanelMode>('time');

  const onOpenChange: DatePickerProps['onOpenChange'] = (open) => {
    if (open) setMode('time');
  };

  return (
    <Flexbox gap={4}>
      <DatePicker
        showTime
        mode={mode}
        onOpenChange={onOpenChange}
        onPanelChange={(_, next) => setMode(next)}
      />
      <Text type="secondary">mode: {mode}</Text>
    </Flexbox>
  );
};

const ControlledRangePicker = () => {
  const [mode, setMode] = useState<[PanelMode, PanelMode]>(['year', 'year']);

  return (
    <Flexbox gap={4}>
      <DateRangePicker mode={mode} onPanelChange={(_, next) => setMode(next)} />
      <Text type="secondary">mode: [{mode.join(', ')}]</Text>
    </Flexbox>
  );
};

export default () => (
  <Flexbox gap={12} padding={16} style={{ maxWidth: 360 }}>
    <ControlledDatePicker />
    <ControlledTimeMode />
    <ControlledRangePicker />
  </Flexbox>
);
