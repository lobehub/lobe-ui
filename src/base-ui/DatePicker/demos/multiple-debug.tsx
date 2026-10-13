import { Flexbox } from '@lobehub/ui';
import { DatePicker, type DatePickerProps } from '@lobehub/ui/base-ui';
import dayjs, { type Dayjs } from 'dayjs';

const onChange: DatePickerProps<Dayjs[]>['onChange'] = (date, dateString) => {
  console.info(date, dateString);
};

const defaultValue = Array.from({ length: 10 }, (_, i) => dayjs('2000-01-01').add(i * 2, 'day'));

export default () => (
  <Flexbox gap={8} padding={16} style={{ maxWidth: 300 }}>
    <DatePicker multiple placeholder="Bamboo" onChange={onChange} />
    <DatePicker multiple defaultValue={defaultValue} size="small" onChange={onChange} />
    <DatePicker multiple defaultValue={defaultValue} onChange={onChange} />
    <DatePicker multiple defaultValue={defaultValue} size="large" onChange={onChange} />
  </Flexbox>
);
