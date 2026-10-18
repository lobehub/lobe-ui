import clsx from 'clsx';
import { type FC } from 'react';

import FlexBasic from './FlexBasic';
import { centerClasses } from './stable';
import type { CenterProps } from './type';

const Center: FC<CenterProps> = ({ children, className, ref, ...props }) => (
  <FlexBasic
    {...props}
    align="center"
    className={clsx(centerClasses(), className)}
    justify="center"
    ref={ref}
  >
    {children}
  </FlexBasic>
);

export default Center;
