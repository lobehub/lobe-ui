import * as stylex from '@stylexjs/stylex';
import type { CSSProperties } from 'react';

import { swatchStyles } from './style';

export interface SwatchProps {
  color?: string;
  radius: number | string;
  size: number;
}

const Swatch = ({ color, radius, size }: SwatchProps) => {
  const boxStyle: CSSProperties = { borderRadius: radius, height: size, width: size };
  return (
    <span aria-hidden {...stylex.props(swatchStyles.box)} style={boxStyle}>
      <span {...stylex.props(swatchStyles.fill)} style={{ background: color || 'transparent' }} />
      {!color && <span {...stylex.props(swatchStyles.slash)} />}
    </span>
  );
};

export default Swatch;
