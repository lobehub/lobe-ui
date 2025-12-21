import { type FC } from 'react';

import FlexBasic from './FlexBasic';
import type { CenterProps } from './type';

const Center: FC<CenterProps> = ({ children, ref, ...props }) => (
  <FlexBasic {...props} align="center" justify="center" ref={ref}>
    {children}
  </FlexBasic>
);

export default Center;
