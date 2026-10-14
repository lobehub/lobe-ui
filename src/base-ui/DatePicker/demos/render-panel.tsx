import { Flexbox } from '@lobehub/ui';
import { DatePicker, Text } from '@lobehub/ui/base-ui';

// antd `render-panel` (debug): the popup rendered inline and always open, for docs and
// visual tests. Not for apps — use `open` / `panelRender` there.
const { _InternalPanelDoNotUseOrYouWillBeFired: PureDatePicker } = DatePicker;
const { _InternalRangePanelDoNotUseOrYouWillBeFired: PureRangePicker } = DatePicker;

export default () => (
  <Flexbox horizontal gap={24} padding={16} style={{ flexWrap: 'wrap' }}>
    <Flexbox gap={8}>
      <Text type="secondary">_InternalPanelDoNotUseOrYouWillBeFired</Text>
      <PureDatePicker />
    </Flexbox>
    <Flexbox gap={8}>
      <Text type="secondary">picker=&quot;month&quot;</Text>
      <PureDatePicker picker="month" />
    </Flexbox>
    <Flexbox gap={8}>
      <Text type="secondary">_InternalRangePanelDoNotUseOrYouWillBeFired</Text>
      <PureRangePicker />
    </Flexbox>
  </Flexbox>
);
