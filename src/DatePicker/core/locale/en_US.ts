import type { Locale } from '../interface';
import { commonLocale } from './common';

const locale: Locale = {
  ...commonLocale,
  locale: 'en_US',
  today: 'Today',
  now: 'Now',
  backToToday: 'Back to today',
  ok: 'OK',
  clear: 'Clear',
  week: 'Week',
  month: 'Month',
  year: 'Year',
  timeSelect: 'select time',
  hour: 'Hour',
  hours: 'Hours',
  minute: 'Minute',
  minutes: 'Minutes',
  seconds: 'Seconds',
  nextSecond: 'Next second',
  previousSecond: 'Previous second',
  dateSelect: 'select date',
  weekSelect: 'Choose a week',
  monthSelect: 'Choose a month',
  yearSelect: 'Choose a year',
  decadeSelect: 'Choose a decade',

  previousMonth: 'Previous month',
  nextMonth: 'Next month',
  previousYear: 'Last year',
  nextYear: 'Next year',
  previousDecade: 'Last decade',
  nextDecade: 'Next decade',
  previousCentury: 'Last century',
  nextCentury: 'Next century',
};

export default locale;
