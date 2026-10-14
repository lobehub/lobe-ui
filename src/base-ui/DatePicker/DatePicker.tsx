'use client';

import dateGenerateConfig from './dateGenerateConfig';
import generatePicker from './generatePicker';
import genPurePanel from './PurePanel';
import type { DatePickerType } from './type';

/**
 * DatePicker over native `Date` — the previous lobe DatePicker API: values, `onChange`
 * and `disabledDate` use `Date`, a cleared range is `[null, null]`; inputs may also be
 * `Dayjs`, date strings or timestamps. Statics as in antd: `DatePicker.RangePicker`,
 * `WeekPicker`, `MonthPicker`, `YearPicker`, `QuarterPicker`, `TimePicker`, the pure panels
 * and `generatePicker`. For the antd `Dayjs` API use `DayjsDatePicker`.
 */
const DatePicker = generatePicker(dateGenerateConfig) as DatePickerType;

DatePicker._InternalPanelDoNotUseOrYouWillBeFired = genPurePanel(DatePicker);
DatePicker._InternalRangePanelDoNotUseOrYouWillBeFired = genPurePanel(DatePicker.RangePicker);
DatePicker.generatePicker = generatePicker;

export default DatePicker;
