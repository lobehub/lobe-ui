import * as stylex from '@stylexjs/stylex';
import type { CSSProperties } from 'react';

import { styleProps } from '@/styles/stylex/props';

import { swatchStyles } from './style';

export interface SwatchProps {
  className?: string;
  color?: string;
  radius: number | string;
  size: number;
}

const Swatch = ({ className, color, radius, size }: SwatchProps) => {
  const boxStyle: CSSProperties = { borderRadius: radius, height: size, width: size };
  return (
    <span aria-hidden {...styleProps(swatchStyles.box, className, boxStyle)}>
      <span {...stylex.props(swatchStyles.fill)} style={{ background: color || 'transparent' }} />
      {!color && <span {...stylex.props(swatchStyles.slash)} />}
    </span>
  );
};

export default Swatch;
