import { Flexbox, Icon } from '@lobehub/ui';
import { Button, DatePicker, DropdownMenu, Text } from '@lobehub/ui/base-ui';
import dayjs, { type Dayjs } from 'dayjs';
import { ChevronDown } from 'lucide-react';
import { type CSSProperties, useState } from 'react';

// antd `external-panel`: the picker's root is hidden and its popup is opened from outside
// with a controlled `open` — here from a base-ui DropdownMenu's "Customize" item.
const hiddenRoot: CSSProperties = {
  bottom: 0,
  insetInlineStart: 0,
  opacity: 0,
  pointerEvents: 'none',
  position: 'absolute',
};

const SingleDemo = () => {
  const [date, setDate] = useState<Dayjs>(() => dayjs());
  const [panelOpen, setPanelOpen] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <DropdownMenu
        items={[
          { key: 'today', label: 'Today', onClick: () => setDate(dayjs()) },
          { key: 'tomorrow', label: 'Tomorrow', onClick: () => setDate(dayjs().add(1, 'day')) },
          { key: 'custom', label: 'Customize…', onClick: () => setPanelOpen(true) },
        ]}
      >
        <Button>
          {date.format('YYYY-MM-DD')}
          <Icon icon={ChevronDown} size={14} />
        </Button>
      </DropdownMenu>
      <DatePicker
        open={panelOpen}
        styles={{ root: hiddenRoot }}
        value={date}
        onOpenChange={setPanelOpen}
        onChange={(next) => {
          if (next) setDate(next);
          setPanelOpen(false);
        }}
      />
    </div>
  );
};

const RangeDemo = () => {
  const [range, setRange] = useState<[Dayjs, Dayjs]>(() => [dayjs(), dayjs().add(7, 'day')]);
  const [panelOpen, setPanelOpen] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <DropdownMenu
        items={[
          {
            key: 'week',
            label: 'Next 7 days',
            onClick: () => setRange([dayjs(), dayjs().add(7, 'day')]),
          },
          {
            key: 'month',
            label: 'Next 30 days',
            onClick: () => setRange([dayjs(), dayjs().add(30, 'day')]),
          },
          { key: 'custom', label: 'Customize…', onClick: () => setPanelOpen(true) },
        ]}
      >
        <Button>
          {range.map((date) => date.format('YYYY-MM-DD')).join(' ~ ')}
          <Icon icon={ChevronDown} size={14} />
        </Button>
      </DropdownMenu>
      <DatePicker.RangePicker
        open={panelOpen}
        styles={{ root: hiddenRoot }}
        value={range}
        onOpenChange={setPanelOpen}
        onChange={(next) => {
          if (next?.[0] && next[1]) setRange([next[0], next[1]]);
          setPanelOpen(false);
        }}
      />
    </div>
  );
};

export default () => (
  <Flexbox gap={12} padding={16}>
    <Text type="secondary">Pick a preset, or “Customize…” to open the picker panel.</Text>
    <Flexbox horizontal gap={12} wrap="wrap">
      <SingleDemo />
      <RangeDemo />
    </Flexbox>
  </Flexbox>
);
