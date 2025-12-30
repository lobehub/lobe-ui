import { type FC } from 'react';

import { AutoFlex } from './AutoFlex';
import type { CenterProps } from './type';

const Center: FC<CenterProps> = ({ children, ref, ...props }) => (
  <AutoFlex {...props} align="center" justify="center" ref={ref}>
    {children}
  </AutoFlex>
);

export default Center;
