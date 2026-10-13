import { Flexbox } from '@lobehub/ui';
import { DatePicker, DateRangePicker, Text } from '@lobehub/ui/base-ui';

// Hover a cell: with the default `previewValue="hover"` the input shows that date until the
// pointer leaves; `previewValue={false}` keeps the input unchanged.
export default () => (
  <Flexbox gap={12} padding={16} style={{ maxWidth: 400 }}>
    <Text type="secondary">previewValue=&quot;hover&quot; (default)</Text>
    <DatePicker />
    <DatePicker showTime />
    <DateRangePicker />
    <Text type="secondary">previewValue={'{false}'}</Text>
    <DatePicker previewValue={false} />
    <DatePicker showTime previewValue={false} />
    <DateRangePicker previewValue={false} />
  </Flexbox>
);
