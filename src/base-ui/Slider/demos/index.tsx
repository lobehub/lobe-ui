import { Flexbox } from '@lobehub/ui';
import { Slider, SliderWithInput } from '@lobehub/ui/base-ui';
import { useState } from 'react';

export default () => {
  const [value, setValue] = useState(0.7);

  return (
    <Flexbox gap={24} padding={16} style={{ maxWidth: 480 }} width={'100%'}>
      <Slider defaultValue={30} />
      <Slider disabled defaultValue={60} />
      <SliderWithInput max={1} min={0} step={0.1} value={value} onChange={setValue} />
      <SliderWithInput defaultValue={20} max={100} min={0} size={'small'} />
    </Flexbox>
  );
};
