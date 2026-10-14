'use client';

import dayjsGenerateConfig from './generateConfig';
import generatePicker from './generatePicker';
import genPurePanel from './PurePanel';
import type { DatePickerType } from './type';

/**
 * DatePicker over Dayjs, with antd's statics: `DatePicker.RangePicker`, `WeekPicker`,
 * `MonthPicker`, `YearPicker`, `QuarterPicker`, `TimePicker`, the debug-only pure panels
 * and `generatePicker`.
 */
const DatePicker = generatePicker(dayjsGenerateConfig) as DatePickerType;

DatePicker._InternalPanelDoNotUseOrYouWillBeFired = genPurePanel(DatePicker);
DatePicker._InternalRangePanelDoNotUseOrYouWillBeFired = genPurePanel(DatePicker.RangePicker);
DatePicker.generatePicker = generatePicker;

export default DatePicker;
