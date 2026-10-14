import { DatePicker, Flexbox, Input, Text } from '@lobehub/ui';
import dayjs from 'dayjs';

const value = [dayjs('2026-01-01'), dayjs('2026-01-03'), dayjs('2026-01-05')];

export default () => (
  <Flexbox gap={16} padding={16} style={{ width: '100%' }}>
    <Text type="secondary">Sizes</Text>
    <Flexbox horizontal align="center" gap={8} wrap="wrap">
      <DatePicker size="small" />
      <DatePicker />
      <DatePicker size="large" />
    </Flexbox>
    <Flexbox horizontal align="center" gap={8} wrap="wrap">
      <DatePicker.RangePicker size="small" />
      <DatePicker.RangePicker />
      <DatePicker.RangePicker size="large" />
    </Flexbox>
    <Text type="secondary">
      Sized to content by default: in a flex row the picker keeps its natural width and does not
      squeeze its siblings
    </Text>
    <Flexbox gap={8}>
      <Flexbox horizontal gap={8}>
        <DatePicker />
        <Input placeholder="Sibling input" />
      </Flexbox>
      <Flexbox horizontal gap={8}>
        <DatePicker showTime />
        <Input placeholder="Sibling input" />
      </Flexbox>
      <Flexbox horizontal gap={8}>
        <DatePicker.RangePicker showTime />
        <Input placeholder="Sibling input" />
      </Flexbox>
      <Flexbox horizontal gap={8}>
        <DatePicker multiple defaultValue={value} />
        <Input placeholder="Sibling input" />
      </Flexbox>
    </Flexbox>
    <Text type="secondary">style.width fills the container; the popup keeps its own width</Text>
    <Flexbox gap={8}>
      <DatePicker style={{ width: '100%' }} />
      <DatePicker.RangePicker style={{ width: '100%' }} />
      <DatePicker
        multiple
        defaultValue={value}
        maxTagCount="responsive"
        style={{ width: '100%' }}
      />
    </Flexbox>
  </Flexbox>
);
