import { Flexbox } from '@lobehub/ui';
import { DatePicker, Text } from '@lobehub/ui/base-ui';
import type { GenerateConfig } from '@rc-component/picker/generate';
import dayjsGenerateConfig from '@rc-component/picker/generate/dayjs';
import dayjs from 'dayjs';
import { useState } from 'react';

// `generatePicker(generateConfig)` builds a DatePicker over another date library. With
// date-fns / moment / Luxon, pass `@rc-component/picker/generate/dateFns` (etc.). Here a
// native `Date` config is derived from the Dayjs one, so the demo needs no extra package.
const toDayjs = (arg: unknown) => (arg instanceof Date ? dayjs(arg) : arg);
const toDate = (result: unknown) => (dayjs.isDayjs(result) ? result.toDate() : result);
const wrap =
  (fn: (...args: any[]) => unknown) =>
  (...args: unknown[]) =>
    toDate(fn(...args.map(toDayjs)));
const { locale, ...methods } = dayjsGenerateConfig;
const dateGenerateConfig = {
  ...Object.fromEntries(Object.entries(methods).map(([name, fn]) => [name, wrap(fn as any)])),
  locale: Object.fromEntries(Object.entries(locale).map(([name, fn]) => [name, wrap(fn as any)])),
} as unknown as GenerateConfig<Date>;

const DateFnsLikePicker = DatePicker.generatePicker<Date>(dateGenerateConfig);

export default () => {
  const [value, setValue] = useState<Date | null>(() => new Date(2026, 9, 15));
  const [range, setRange] = useState<[Date | null, Date | null] | null>(null);

  return (
    <Flexbox gap={12} padding={16} style={{ maxWidth: 320 }}>
      <DateFnsLikePicker value={value} onChange={(date) => setValue(date)} />
      <DateFnsLikePicker.MonthPicker value={value} onChange={(date) => setValue(date)} />
      <DateFnsLikePicker.RangePicker value={range} onChange={setRange} />
      <Text type="secondary">
        value instanceof Date: {String(value instanceof Date)} → {value?.toDateString() ?? 'null'}
      </Text>
      <Text type="secondary">
        range: {range ? range.map((date) => date?.toDateString() ?? 'null').join(' ~ ') : 'null'}
      </Text>
    </Flexbox>
  );
};
