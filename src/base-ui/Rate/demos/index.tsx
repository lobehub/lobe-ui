import { Flexbox } from '@lobehub/ui';
import { Rate } from '@lobehub/ui/base-ui';
import { Heart } from 'lucide-react';
import { useState } from 'react';

export default () => {
  const [value, setValue] = useState(3.5);

  return (
    <Flexbox gap={20} padding={16}>
      <Flexbox horizontal align="center" gap={12}>
        <Rate allowHalf value={value} onChange={setValue} />
        <span>{value}</span>
      </Flexbox>
      <Rate readOnly size={16} value={4.3} />
      <Rate character={<Heart fill="currentColor" size={20} />} color="#f43f5e" defaultValue={2} />
      <Rate disabled defaultValue={3} />
    </Flexbox>
  );
};
