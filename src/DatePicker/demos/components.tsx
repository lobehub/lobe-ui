import { Flexbox } from '@lobehub/ui';
import {
  Button,
  DayjsDatePicker as DatePicker,
  type PickerPanelProps,
  Slider,
  Text,
} from '@lobehub/ui';
import dayjs, { type Dayjs } from 'dayjs';
import type { InputHTMLAttributes, ReactNode } from 'react';

// `components` replaces a panel (`date` / `week` / `month` / `quarter` / `year` / `decade` /
// `time`), the `input` or the OK `button`. A custom panel gets `value`, `onHover` (previews in
// the input) and `onSelect` (picks, as clicking a cell would).
const SliderPanel = ({ onHover, onSelect, value }: PickerPanelProps<Dayjs>) => {
  const today = dayjs().startOf('day');
  const offset = value ? value.startOf('day').diff(today, 'day') : 0;

  return (
    <Flexbox gap={12} padding={16} style={{ width: 280 }}>
      <Text strong>In {offset} days</Text>
      <Text type="secondary">{today.add(offset, 'day').format('dddd, MMMM D, YYYY')}</Text>
      <Slider
        max={30}
        min={0}
        value={offset}
        onChange={(days) => onHover?.(today.add(days, 'day'))}
        onChangeComplete={(days) => onSelect(today.add(days, 'day'))}
      />
      <Flexbox horizontal gap={8}>
        {[1, 7, 14].map((days) => (
          <Button key={days} size="small" onClick={() => onSelect(today.add(days, 'day'))}>
            +{days}d
          </Button>
        ))}
      </Flexbox>
    </Flexbox>
  );
};

const ConfirmButton = ({
  children,
  ...props
}: {
  children?: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}) => (
  <Button size="small" type="dashed" {...props}>
    {children} ✓
  </Button>
);

const MonoInput = (props: InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} style={{ ...props.style, fontFamily: 'monospace' }} />
);

export default () => (
  <Flexbox gap={12} padding={16} style={{ maxWidth: 400 }}>
    <DatePicker components={{ date: SliderPanel }} placeholder="components.date" showNow={false} />
    <DatePicker
      needConfirm
      components={{ button: ConfirmButton }}
      placeholder="components.button"
    />
    <DatePicker components={{ input: MonoInput }} placeholder="components.input" />
    <DatePicker
      inputRender={(props) => <input {...props} style={{ ...props.style, letterSpacing: 2 }} />}
      placeholder="inputRender (deprecated)"
    />
  </Flexbox>
);
