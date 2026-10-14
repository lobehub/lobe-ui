import { Flexbox } from '@lobehub/ui';
import { Button, DatePicker, type PickerRef, Text } from '@lobehub/ui/base-ui';
import dayjs, { type Dayjs } from 'dayjs';
import { useRef, useState } from 'react';

export default () => {
  const ref = useRef<PickerRef>(null);
  const [open, setOpen] = useState(false);
  const [pickerValue, setPickerValue] = useState<Dayjs>(() => dayjs().startOf('month'));
  const [events, setEvents] = useState<string[]>([]);

  const log = (event: string) => setEvents((prev) => [event, ...prev].slice(0, 4));

  return (
    <Flexbox gap={12} padding={16} style={{ maxWidth: 360 }}>
      <Flexbox horizontal gap={8} wrap="wrap">
        <Button onClick={() => setOpen((prev) => !prev)}>{open ? 'Close' : 'Open'}</Button>
        <Button onClick={() => setPickerValue(dayjs().add(1, 'year').startOf('year'))}>
          Jump to next January
        </Button>
        <Button onClick={() => ref.current?.focus()}>Focus</Button>
      </Flexbox>
      <DatePicker
        inputReadOnly
        open={open}
        pickerValue={pickerValue}
        ref={ref}
        onBlur={() => log('blur')}
        onFocus={() => log('focus')}
        onKeyDown={(event) => log(`keydown ${event.key}`)}
        onOpenChange={(next) => {
          setOpen(next);
          log(`openChange ${next}`);
        }}
        onPickerValueChange={(date, info) => {
          log(`pickerValue ${date.format('YYYY-MM')} (${info.source})`);
          // `reset` fires on every open; ignoring it keeps the panel where the buttons put it
          if (info.source === 'panel') setPickerValue(date);
        }}
      />
      <Text type="secondary">panel: {pickerValue.format('YYYY-MM')}</Text>
      <Text code>{events.join(' · ') || 'no events yet'}</Text>
    </Flexbox>
  );
};
