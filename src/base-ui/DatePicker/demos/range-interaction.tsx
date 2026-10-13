import { Flexbox } from '@lobehub/ui';
import { Button, DateRangePicker, type RangePickerRef, Text } from '@lobehub/ui/base-ui';
import dayjs from 'dayjs';
import { useRef, useState } from 'react';

export default () => {
  const ref = useRef<RangePickerRef>(null);
  const [active, setActive] = useState('—');
  const [ordered, setOrdered] = useState<[string, string] | null>(null);
  const [unordered, setUnordered] = useState<[string, string] | null>(null);

  return (
    <Flexbox gap={12} padding={16} style={{ maxWidth: 480 }}>
      <Flexbox horizontal gap={8}>
        <Button onClick={() => ref.current?.focus(0)}>focus(0)</Button>
        <Button onClick={() => ref.current?.focus({ index: 1 })}>
          focus(&#123; index: 1 &#125;)
        </Button>
      </Flexbox>
      {/* Click the end input first to pick the end date first; Tab moves to the other end. */}
      <DateRangePicker
        defaultValue={[dayjs().add(-7, 'day'), dayjs()]}
        ref={ref}
        onCalendarChange={(_dates, _dateStrings, info) => setActive(`picked ${info.range}`)}
        onFocus={(_event, info) => setActive(`focus ${info.range}`)}
      />
      <Text type="secondary">Active end: {active}</Text>
      <Text strong>order (default true) vs order=&#123;false&#125;</Text>
      <DateRangePicker
        defaultValue={[dayjs('2026-10-10'), dayjs('2026-10-20')]}
        onChange={(_dates, dateStrings) => setOrdered(dateStrings)}
      />
      <DateRangePicker
        defaultValue={[dayjs('2026-10-10'), dayjs('2026-10-20')]}
        order={false}
        onChange={(_dates, dateStrings) => setUnordered(dateStrings)}
      />
      <Text type="secondary">
        Type an end earlier than the start: ordered {JSON.stringify(ordered)} / unordered{' '}
        {JSON.stringify(unordered)}
      </Text>
    </Flexbox>
  );
};
