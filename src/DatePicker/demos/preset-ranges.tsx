import { Flexbox } from '@lobehub/ui';
import {
  DayjsDatePicker as DatePicker,
  DayjsDateRangePicker as DateRangePicker,
  type PresetDate,
  Text,
} from '@lobehub/ui';
import dayjs, { type Dayjs } from 'dayjs';
import { useState } from 'react';

// `presets` adds a sidebar of quick picks. A `value` may be a function, evaluated when the
// preset is hovered or picked, so "now"-relative presets stay fresh.
const datePresets: PresetDate<Dayjs>[] = [
  { label: 'Yesterday', value: dayjs().add(-1, 'd') },
  { label: 'Last Week', value: dayjs().add(-7, 'd') },
  { label: 'Last Month', value: dayjs().add(-1, 'month') },
  { label: 'Now (function)', value: () => dayjs() },
  { label: 'Start of month (function)', value: () => dayjs().startOf('month') },
];

const rangePresets: PresetDate<[Dayjs, Dayjs]>[] = [
  { label: 'Last 7 Days', value: [dayjs().add(-7, 'd'), dayjs()] },
  { label: 'Last 14 Days', value: [dayjs().add(-14, 'd'), dayjs()] },
  { label: 'Last 30 Days', value: [dayjs().add(-30, 'd'), dayjs()] },
  { label: 'Last 90 Days', value: [dayjs().add(-90, 'd'), dayjs()] },
  {
    label: 'This month (function)',
    value: () => [dayjs().startOf('month'), dayjs().endOf('month')],
  },
];

export default () => {
  const [log, setLog] = useState('—');

  return (
    <Flexbox gap={12} padding={16} style={{ maxWidth: 420 }}>
      <DatePicker
        placeholder="Date presets"
        presets={[...datePresets, { label: 'Next Month', value: dayjs().add(1, 'month') }]}
        onChange={(_date, dateString) => setLog(`DatePicker: ${JSON.stringify(dateString)}`)}
      />
      <DateRangePicker
        presets={rangePresets}
        onChange={(_dates, dateStrings) => setLog(`RangePicker: ${JSON.stringify(dateStrings)}`)}
      />
      <DateRangePicker
        showTime
        format="YYYY/MM/DD HH:mm:ss"
        presets={[
          {
            label: <span aria-label="Current Time to End of Day">Now ~ EOD</span>,
            value: () => [dayjs(), dayjs().endOf('day')],
          },
          ...rangePresets,
        ]}
        onChange={(_dates, dateStrings) =>
          setLog(`RangePicker showTime: ${JSON.stringify(dateStrings)}`)
        }
      />
      <Text type="secondary">{log}</Text>
    </Flexbox>
  );
};
