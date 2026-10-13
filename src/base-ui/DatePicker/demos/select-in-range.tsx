import { Flexbox } from '@lobehub/ui';
import { DateRangePicker, type DateRangePickerProps, Text } from '@lobehub/ui/base-ui';

/** At most 7 days: once one end is picked, `info.from` is that date. */
const disabled7DaysDate: DateRangePickerProps['disabledDate'] = (current, { from, type }) => {
  if (!from) return false;
  const minDate = from.add(-6, 'day');
  const maxDate = from.add(6, 'day');

  switch (type) {
    case 'year': {
      return current.year() < minDate.year() || current.year() > maxDate.year();
    }
    case 'month': {
      return (
        current.startOf('month').isBefore(minDate.startOf('month')) ||
        current.startOf('month').isAfter(maxDate.startOf('month'))
      );
    }
    default: {
      return Math.abs(current.diff(from, 'day')) >= 7;
    }
  }
};

/** At most 6 months in a month picker. */
const disabled6MonthsDate: DateRangePickerProps['disabledDate'] = (current, { from }) =>
  !!from && Math.abs(current.diff(from, 'month')) >= 6;

export default () => (
  <Flexbox gap={12} padding={16} style={{ maxWidth: 400 }}>
    <Text strong>7 days range</Text>
    <DateRangePicker disabledDate={disabled7DaysDate} />
    <Text strong>6 months range</Text>
    <DateRangePicker disabledDate={disabled6MonthsDate} picker="month" />
  </Flexbox>
);
