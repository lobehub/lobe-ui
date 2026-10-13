import { Flexbox } from '@lobehub/ui';
import { DatePicker, DateRangePicker } from '@lobehub/ui/base-ui';

export default () => (
  <Flexbox gap={12} padding={16} style={{ maxWidth: 360 }}>
    <Flexbox horizontal gap={8}>
      <DatePicker placeholder="Outlined" variant="outlined" />
      <DateRangePicker placeholder={['Outlined', 'Outlined']} variant="outlined" />
    </Flexbox>
    <Flexbox horizontal gap={8}>
      <DatePicker placeholder="Filled" variant="filled" />
      <DateRangePicker placeholder={['Filled', 'Filled']} variant="filled" />
    </Flexbox>
    <Flexbox horizontal gap={8}>
      <DatePicker placeholder="Borderless" variant="borderless" />
      <DateRangePicker placeholder={['Borderless', 'Borderless']} variant="borderless" />
    </Flexbox>
    <Flexbox horizontal gap={8}>
      <DatePicker placeholder="Underlined" variant="underlined" />
      <DateRangePicker placeholder={['Underlined', 'Underlined']} variant="underlined" />
    </Flexbox>
    <Flexbox horizontal gap={8}>
      {/* Deprecated alias of `variant="borderless"`. */}
      <DatePicker bordered={false} placeholder="bordered={false}" />
      <DateRangePicker bordered={false} placeholder={['bordered', '{false}']} />
    </Flexbox>
    <Flexbox horizontal gap={8}>
      <DatePicker shadow placeholder="Shadow" variant="outlined" />
      <DateRangePicker shadow placeholder={['Shadow', 'Shadow']} variant="outlined" />
    </Flexbox>
  </Flexbox>
);
