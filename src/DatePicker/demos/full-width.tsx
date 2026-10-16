import { DateRangePicker, Flexbox } from '@lobehub/ui';

export default () => (
  <Flexbox gap={12} style={{ width: '100%' }}>
    {/* `styles.root` (or `style`) sizes the box; both inputs flex to fill it. */}
    <DateRangePicker styles={{ root: { width: '100%' } }} />
    <DateRangePicker
      classNames={{ input: 'my-range-input' }}
      styles={{ root: { width: '100%' }, input: { textAlign: 'center' } }}
    />
  </Flexbox>
);
