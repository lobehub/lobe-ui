import { Flexbox, Icon } from '@lobehub/ui';
import { DatePicker, DateRangePicker } from '@lobehub/ui/base-ui';
import { Smile } from 'lucide-react';

export default () => (
  <Flexbox gap={12} padding={16} style={{ maxWidth: 360 }}>
    <DatePicker suffixIcon={<Icon icon={Smile} size={14} />} />
    <DatePicker suffixIcon={null} />
    <DateRangePicker suffixIcon={<Icon icon={Smile} size={14} />} />
    <DateRangePicker suffixIcon={null} />
  </Flexbox>
);
