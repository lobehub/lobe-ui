'use client';

import dayjsGenerateConfig from './generateConfig';
import generatePicker from './generatePicker';
import genPurePanel from './PurePanel';
import type { DayjsDatePickerType } from './type';

/**
 * antd-aligned DatePicker over `Dayjs` (values, callbacks and `disabledDate` are `Dayjs`),
 * with antd's statics: `RangePicker`, `WeekPicker`, `MonthPicker`, `YearPicker`,
 * `QuarterPicker`, `TimePicker`, the debug-only pure panels and `generatePicker`.
 * The default `DatePicker` export works with native `Date` (the previous lobe API).
 */
const DayjsDatePicker = generatePicker(dayjsGenerateConfig) as DayjsDatePickerType;

DayjsDatePicker._InternalPanelDoNotUseOrYouWillBeFired = genPurePanel(DayjsDatePicker);
DayjsDatePicker._InternalRangePanelDoNotUseOrYouWillBeFired = genPurePanel(
  DayjsDatePicker.RangePicker,
);
DayjsDatePicker.generatePicker = generatePicker;

export default DayjsDatePicker;
