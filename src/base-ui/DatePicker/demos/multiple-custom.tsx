import { Flexbox } from '@lobehub/ui';
import { DatePicker, type PickerTagProps, Tag } from '@lobehub/ui/base-ui';
import dayjs, { type Dayjs } from 'dayjs';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

const tagRender = ({ closable, label, onClose, value }: PickerTagProps) => (
  <Tag
    closable={closable}
    color={value.day() === 0 || value.day() === 6 ? 'orange' : 'blue'}
    style={{ marginInlineEnd: 4 }}
    onClose={(event) => onClose(event)}
    onMouseDown={(event) => event.preventDefault()}
  >
    {label}
  </Tag>
);

export default () => {
  const [value, setValue] = useState<Dayjs[]>(() => [dayjs('2024-05-01'), dayjs('2024-03-01')]);
  const [dateString, setDateString] = useState<string[]>([]);

  return (
    <Flexbox gap={8} padding={16} style={{ maxWidth: 360 }}>
      {/* controlled, order={false} keeps picking order, at most 2 tags */}
      <DatePicker
        multiple
        maxTagCount={2}
        order={false}
        value={value}
        onChange={(dates, strings) => {
          setValue(dates ?? []);
          setDateString(strings);
        }}
      />
      <span style={{ fontSize: 12 }}>onChange dateString: {JSON.stringify(dateString)}</span>
      <DatePicker multiple placeholder="tagRender: base-ui Tag" tagRender={tagRender} />
      <DatePicker
        multiple
        defaultValue={[dayjs('2024-01-01'), dayjs('2024-01-02')]}
        placeholder="removeIcon"
        removeIcon={<Trash2 size={10} />}
      />
      <DatePicker multiple picker="week" placeholder="multiple week" />
      <DatePicker multiple picker="month" placeholder="multiple month" />
      <DatePicker multiple picker="quarter" placeholder="multiple quarter" />
      <DatePicker multiple picker="year" placeholder="multiple year" />
      <DatePicker disabled multiple defaultValue={[dayjs('2024-01-01'), dayjs('2024-01-02')]} />
    </Flexbox>
  );
};
