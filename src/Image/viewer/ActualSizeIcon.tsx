'use client';

import { memo } from 'react';

import { styles } from '../style';

// lucide's Expand, kept as four separate corners so each can be transformed on
// its own. Expand and Shrink are not two unrelated glyphs: rotating each of
// these corners 180° about its own quadrant centre maps Expand onto Shrink
// exactly, coordinate for coordinate. That makes the toggle a transform
// animation rather than a path interpolation, so it needs no morphing library
// and stays on the compositor.
const CORNERS = [
  { d: 'm21 21-6-6m6 6v-4.8m0 4.8h-4.8', origin: '18px 18px' },
  { d: 'M3 16.2V21m0 0h4.8M3 21l6-6', origin: '6px 18px' },
  { d: 'M21 7.8V3m0 0h-4.8M21 3l-6 6', origin: '18px 6px' },
  { d: 'M3 7.8V3m0 0h4.8M3 3l6 6', origin: '6px 6px' },
];

export interface ActualSizeIconProps {
  color?: string;
  fill?: string;
  height?: number | string;
  strokeWidth?: number | string;
  width?: number | string;
}

const ActualSizeIcon = memo<ActualSizeIconProps>(
  ({ color = 'currentColor', fill = 'none', height = 24, strokeWidth = 2, width = 24 }) => (
    <svg
      fill={fill}
      height={height}
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      viewBox="0 0 24 24"
      width={width}
      xmlns="http://www.w3.org/2000/svg"
    >
      {CORNERS.map(({ d, origin }) => (
        <path
          className={styles.actualSizeCorner}
          d={d}
          key={d}
          style={{ transformOrigin: origin }}
        />
      ))}
    </svg>
  ),
);

ActualSizeIcon.displayName = 'ActualSizeIcon';

export default ActualSizeIcon;
