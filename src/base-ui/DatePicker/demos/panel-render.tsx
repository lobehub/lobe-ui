import { Flexbox } from '@lobehub/ui';
import {
  DayjsDatePicker as DatePicker,
  DayjsDateRangePicker as DateRangePicker,
  Text,
} from '@lobehub/ui/base-ui';
import dayjs from 'dayjs';
import type { ReactNode } from 'react';

// `panelRender(panel)` wraps the whole popup content (presets, panels and footer included),
// e.g. to add a header or side note around the calendar.
const withHeader = (title: string) => (panel: ReactNode) => (
  <Flexbox gap={4}>
    <Text strong style={{ paddingBlockStart: 8, paddingInline: 12 }}>
      {title}
    </Text>
    {panel}
  </Flexbox>
);

export default () => (
  <Flexbox gap={12} padding={16} style={{ maxWidth: 400 }}>
    <DatePicker panelRender={withHeader('Pick a due date')} />
    <DatePicker
      presets={[{ label: 'Tomorrow', value: () => dayjs().add(1, 'd') }]}
      panelRender={(panel) => (
        <Flexbox horizontal>
          {panel}
          <Flexbox gap={4} padding={12} style={{ maxWidth: 140 }}>
            <Text strong>Tips</Text>
            <Text fontSize={12} type="secondary">
              Weekends are fine. The deadline is end of day in your time zone.
            </Text>
          </Flexbox>
        </Flexbox>
      )}
    />
    <DateRangePicker panelRender={withHeader('Pick a stay')} />
  </Flexbox>
);
