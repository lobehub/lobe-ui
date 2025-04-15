import { ImageSelect } from '@lobehub/ui';
import { useState } from 'react';

export default () => {
  const [active, setActive] = useState('a');
  return (
    <ImageSelect
      height={86}
      onChange={setActive}
      options={[
        {
          img: `https://registry.npmmirror.com/@lobehub/assets-emoji/1.3.0/files/assets/robot.webp`,
          label: 'A',
          value: 'a',
        },
        {
          img: `https://registry.npmmirror.com/@lobehub/assets-emoji/1.3.0/files/assets/convenience-store.webp`,
          label: 'B',
          value: 'b',
        },
      ]}
      value={active}
      width={86}
    />
  );
};
