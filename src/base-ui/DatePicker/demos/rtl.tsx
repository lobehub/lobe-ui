import { Flexbox, Icon } from '@lobehub/ui';
import { DatePicker, DateRangePicker } from '@lobehub/ui/base-ui';
import { ArrowLeftRight } from 'lucide-react';

export default () => (
  <Flexbox dir="rtl" gap={12} padding={16} style={{ maxWidth: 360 }}>
    <DatePicker direction="rtl" />
    <DateRangePicker direction="rtl" />
    <DateRangePicker
      allowClear={{ clearIcon: '×' }}
      direction="rtl"
      separator={<Icon icon={ArrowLeftRight} size={14} />}
    />
  </Flexbox>
);
