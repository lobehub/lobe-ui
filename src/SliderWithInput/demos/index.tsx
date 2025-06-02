import { SliderWithInput } from '@lobehub/ui';
import { useState } from 'react';

export default () => {
  const [value, setValue] = useState(0);
  return <SliderWithInput changeOnWheel={true} max={100} min={0} onChange={setValue} style={{ width: 300 }} value={value} />;
};
