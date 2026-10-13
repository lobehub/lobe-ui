import { Flexbox } from '@lobehub/ui';
import { DatePicker, DateRangePicker } from '@lobehub/ui/base-ui';

// `renderExtraFooter(mode)` adds a row above the Today / Now / OK footer; it receives the
// current panel mode, so the text can follow the panel. Range pickers support it too.
export default () => (
  <Flexbox gap={12} padding={16} style={{ maxWidth: 400 }}>
    <DatePicker renderExtraFooter={(mode) => `extra footer · ${mode} panel`} />
    <DatePicker showTime renderExtraFooter={() => 'extra footer'} />
    <DateRangePicker renderExtraFooter={() => 'extra footer'} />
    <DateRangePicker showTime renderExtraFooter={() => 'extra footer'} />
    <DatePicker picker="month" renderExtraFooter={() => 'extra footer'} />
    {/* The date panel shows a Today button; `showToday` is the deprecated alias of `showNow`. */}
    <DatePicker placeholder="showToday={false}" showToday={false} />
    <DateRangePicker showNow />
  </Flexbox>
);
