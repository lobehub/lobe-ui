import type { GenerateConfig } from './core/generate';
import generateRangePicker from './RangePicker';
import generateSinglePicker from './SinglePicker';
import type { GeneratedDatePicker } from './type';

/**
 * antd `generatePicker`: a DatePicker (with `RangePicker`, `WeekPicker`, `MonthPicker`,
 * `YearPicker`, `QuarterPicker` and `TimePicker` statics) over another date library, given
 * its `GenerateConfig` — e.g. `@rc-component/picker/generate/dateFns`, installed by the app.
 */
const generatePicker = <DateType extends object>(
  generateConfig: GenerateConfig<DateType>,
): GeneratedDatePicker<DateType> => {
  const { DatePicker, WeekPicker, MonthPicker, YearPicker, QuarterPicker, TimePicker } =
    generateSinglePicker(generateConfig);

  DatePicker.WeekPicker = WeekPicker;
  DatePicker.MonthPicker = MonthPicker;
  DatePicker.YearPicker = YearPicker;
  DatePicker.QuarterPicker = QuarterPicker;
  DatePicker.TimePicker = TimePicker;
  DatePicker.RangePicker = generateRangePicker(generateConfig);

  return DatePicker;
};

export default generatePicker;
