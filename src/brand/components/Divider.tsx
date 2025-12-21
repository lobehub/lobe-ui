import { type FC } from 'react';

import { DivProps, SvgProps } from '@/types';

const Divider: FC<SvgProps & DivProps & { size?: number }> = ({ size = '1em', style, ...rest }) => (
  <svg
    fill="none"
    height={size}
    shapeRendering="geometricPrecision"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ flex: 'none', lineHeight: 1, ...style }}
    viewBox="0 0 24 24"
    width={size}
    {...rest}
  >
    <path d="M16.88 3.549L7.12 20.451" />
  </svg>
);

export default Divider;
