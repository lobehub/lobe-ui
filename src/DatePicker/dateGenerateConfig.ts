import dayjs, { type Dayjs } from 'dayjs';

import type { GenerateConfig } from './core/generate';
import dayjsGenerateConfig from './generateConfig';

const c = dayjsGenerateConfig;
const inn = (value: Date): Dayjs => dayjs(value);
const out = (value: Dayjs): Date => value.toDate();

/**
 * rc-picker config over native `Date`, built on the dayjs config (parsing, formatting, week
 * rules and locales stay dayjs'). The default `DatePicker` / `DateRangePicker` use it so
 * values, callbacks and `disabledDate` are native `Date`, as in the previous lobe DatePicker.
 */
const dateGenerateConfig: GenerateConfig<Date> = {
  addDate: (value, diff) => out(c.addDate(inn(value), diff)),
  addMonth: (value, diff) => out(c.addMonth(inn(value), diff)),
  addYear: (value, diff) => out(c.addYear(inn(value), diff)),
  getDate: (value) => c.getDate(inn(value)),
  getEndDate: (value) => out(c.getEndDate(inn(value))),
  getFixedDate: (fixed) => out(c.getFixedDate(fixed)),
  getHour: (value) => c.getHour(inn(value)),
  getMillisecond: (value) => c.getMillisecond(inn(value)),
  getMinute: (value) => c.getMinute(inn(value)),
  getMonth: (value) => c.getMonth(inn(value)),
  getNow: () => new Date(),
  getSecond: (value) => c.getSecond(inn(value)),
  getWeekDay: (value) => c.getWeekDay(inn(value)),
  getYear: (value) => c.getYear(inn(value)),
  isAfter: (date1, date2) => c.isAfter(inn(date1), inn(date2)),
  isValidate: (date) => date instanceof Date && !Number.isNaN(date.getTime()),
  locale: {
    format: (locale, date, format) => c.locale.format(locale, inn(date), format),
    getShortMonths: c.locale.getShortMonths,
    getShortWeekDays: c.locale.getShortWeekDays,
    getWeek: (locale, value) => c.locale.getWeek(locale, inn(value)),
    getWeekFirstDate: (locale, value) => out(c.locale.getWeekFirstDate(locale, inn(value))),
    getWeekFirstDay: c.locale.getWeekFirstDay,
    parse: (locale, text, formats) => {
      const parsed = c.locale.parse(locale, text, formats);
      return parsed ? out(parsed) : null;
    },
  },
  setDate: (value, date) => out(c.setDate(inn(value), date)),
  setHour: (value, hour) => out(c.setHour(inn(value), hour)),
  setMillisecond: (value, ms) => out(c.setMillisecond(inn(value), ms)),
  setMinute: (value, minute) => out(c.setMinute(inn(value), minute)),
  setMonth: (value, month) => out(c.setMonth(inn(value), month)),
  setSecond: (value, second) => out(c.setSecond(inn(value), second)),
  setYear: (value, year) => out(c.setYear(inn(value), year)),
};

export default dateGenerateConfig;
