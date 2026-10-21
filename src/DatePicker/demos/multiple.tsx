import {
  DayjsDatePicker as DatePicker,
  type DayjsDatePickerProps as DatePickerProps,
  Flexbox,
} from '@lobehub/ui';
import dayjs, { type Dayjs } from 'dayjs';

const onChange: DatePickerProps<Dayjs[]>['onChange'] = (date, dateString) => {
  console.info(date, dateString);
};

const defaultValue = [dayjs('2000-01-01'), dayjs('2000-01-03'), dayjs('2000-01-05')];

export default () => (
  <Flexbox gap={8} padding={16} style={{ maxWidth: 300 }}>
    <DatePicker
      multiple
      defaultValue={defaultValue}
      maxTagCount="responsive"
      size="small"
      onChange={onChange}
    />
    <DatePicker multiple defaultValue={defaultValue} maxTagCount="responsive" onChange={onChange} />
    <DatePicker
      multiple
      defaultValue={defaultValue}
      maxTagCount="responsive"
      size="large"
      onChange={onChange}
    />
  </Flexbox>
);
