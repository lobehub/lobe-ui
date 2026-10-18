import { type FC } from 'react';

import { styles } from '@/brand/components/style';
import { styleProps } from '@/styles/stylex/props';
import type { DivProps, SvgProps } from '@/types';

const Divider: FC<SvgProps & DivProps & { size?: number }> = ({
  size = '1em',
  className,
  style,
  ...rest
}) => (
  <svg
    fill="none"
    height={size}
    shapeRendering="geometricPrecision"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
    width={size}
    {...styleProps(styles.svg, className, style)}
    {...rest}
  >
    <path d="M16.88 3.549L7.12 20.451" />
  </svg>
);

export default Divider;
