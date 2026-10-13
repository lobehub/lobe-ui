import { Flexbox, Icon } from '@lobehub/ui';
import { DatePicker, DateRangePicker } from '@lobehub/ui/base-ui';
import { Smile } from 'lucide-react';

const smile = <Icon icon={Smile} size={14} />;

export default () => (
  <Flexbox gap={12} padding={16} style={{ maxWidth: 360 }}>
    <DatePicker suffixIcon={smile} />
    <DatePicker picker="month" suffixIcon={smile} />
    <DateRangePicker suffixIcon={smile} />
    <DatePicker suffixIcon="ab" />
    <DateRangePicker suffixIcon="ab" />
    <DatePicker prefix={smile} />
    <DatePicker picker="month" prefix={smile} />
    <DateRangePicker prefix={smile} />
  </Flexbox>
);
