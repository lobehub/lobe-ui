import { Flexbox } from '@lobehub/ui';
import {
  DayjsDatePicker as DatePicker,
  type DayjsDatePickerProps as DatePickerProps,
  DayjsDateRangePicker as DateRangePicker,
  type DayjsDateRangePickerProps as DateRangePickerProps,
} from '@lobehub/ui/base-ui';
import dayjs from 'dayjs';

const range = (start: number, end: number) =>
  Array.from({ length: end - start }, (_, index) => start + index);

// Can not select days before today and today.
const disabledDate: DatePickerProps['disabledDate'] = (current) =>
  current && current < dayjs().endOf('day');

const disabledDateTime: DatePickerProps['disabledTime'] = () => ({
  disabledHours: () => range(0, 24).splice(4, 20),
  disabledMinutes: () => range(30, 60),
  disabledSeconds: () => [55, 56],
});

// `partial` says which end is being picked.
const disabledRangeTime: DateRangePickerProps['disabledTime'] = (_, partial) =>
  partial === 'start'
    ? {
        disabledHours: () => range(0, 60).splice(4, 20),
        disabledMinutes: () => range(30, 60),
        disabledSeconds: () => [55, 56],
      }
    : {
        disabledHours: () => range(0, 60).splice(20, 4),
        disabledMinutes: () => range(0, 31),
        disabledSeconds: () => [55, 56],
      };

// `info.from` is the start already picked: on that day the end can not be earlier.
const disabledEndBeforeStart: DateRangePickerProps['disabledTime'] = (date, partial, info) => {
  const from = info.from;
  if (partial !== 'end' || !from || !date?.isSame(from, 'day')) return {};
  return {
    disabledHours: () => range(0, from.hour()),
    disabledMinutes: (hour) => (hour === from.hour() ? range(0, from.minute()) : []),
  };
};

const startOfDay = dayjs().startOf('day');

export default () => (
  <Flexbox gap={12} padding={16} style={{ maxWidth: 400 }}>
    <DatePicker
      disabledDate={disabledDate}
      disabledTime={disabledDateTime}
      format="YYYY-MM-DD HH:mm:ss"
      showTime={{ defaultOpenValue: startOfDay }}
    />
    <DatePicker disabledDate={disabledDate} picker="month" />
    <DateRangePicker disabledDate={disabledDate} />
    <DateRangePicker
      disabledDate={disabledDate}
      disabledTime={disabledRangeTime}
      format="YYYY-MM-DD HH:mm:ss"
      showTime={{
        defaultOpenValue: [startOfDay, startOfDay.hour(11).minute(59).second(59)],
        hideDisabledOptions: true,
      }}
    />
    <DateRangePicker
      disabledTime={disabledEndBeforeStart}
      format="YYYY-MM-DD HH:mm"
      placeholder={['Start (info.from)', 'End']}
      showTime={{ format: 'HH:mm' }}
    />
  </Flexbox>
);
