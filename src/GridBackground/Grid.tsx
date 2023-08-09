import { isUndefined } from 'lodash-es';
import { memo, useCallback } from 'react';

import { DivProps } from '@/types';

enum Line {
  l7,
  l6,
  l5,
  l4,
  l3,
  l2,
  l1,
  center,
  r1,
  r2,
  r3,
  r4,
  r5,
  r6,
  r7,
}

export interface GridProps extends DivProps {
  color?: string;
  linePick?: Line;
  strokeWidth?: number;
}

const Grid = memo<GridProps>(({ color = '#fff', strokeWidth = 3, linePick, ...props }) => {
  const isUnpick = isUndefined(linePick);

  const showLine = useCallback((l: Line) => isUnpick || linePick === l, [linePick]);

  const vLine = (
    <>
      {showLine(Line.l7) && <path d="M2 420v-60.343c0-21.82 14.15-41.12 34.959-47.684L1026 0h0" />}
      {showLine(Line.l6) && (
        <path d="M268 420v-62.077c0-20.977 13.094-39.724 32.789-46.944L1149 0h0" />
      )}
      {showLine(Line.l5) && <path d="M534 420v-64.358a50 50 0 0129.884-45.775L1269 0h0" />}
      {showLine(Line.l4) && <path d="M800 420v-67.395a50 50 0 0125.958-43.84L1389 0h0" />}
      {showLine(Line.l3) && <path d="M1066 420v-71.645a50 50 0 0120.456-40.337L1507 0h0" />}
      {showLine(Line.l2) && <path d="M1332 420v-77.506a50 50 0 0113.194-33.843L1629 0h0" />}
      {showLine(Line.l1) && <path d="M1598 420v-86.225a50 50 0 014.438-20.594L1744 0h0" />}
      {showLine(Line.center) && <path d="M1864 420V0h0" />}
      {showLine(Line.r1) && <path d="M2130 420v-86.225a50 50 0 00-4.438-20.594L1984 0h0" />}
      {showLine(Line.r2) && <path d="M2396 420v-77.506a50 50 0 00-13.194-33.843L2099 0h0" />}
      {showLine(Line.r3) && <path d="M2662 420v-71.645a50 50 0 00-20.456-40.337L2221 0h0" />}
      {showLine(Line.r4) && <path d="M2928 420v-67.395a50 50 0 00-25.958-43.84L2339 0h0" />}
      {showLine(Line.r5) && <path d="M3194 420v-64.358a50 50 0 00-29.884-45.775L2459 0h0" />}
      {showLine(Line.r6) && (
        <path d="M3460 420v-62.077c0-20.977-13.094-39.724-32.789-46.944L2579 0h0" />
      )}
      {showLine(Line.r7) && (
        <path d="M3726 420v-60.343c0-21.82-14.15-41.12-34.959-47.684L2702 0h0" />
      )}
    </>
  );

  const hLine = isUnpick && (
    <>
      <path d="M2835 42H892" />
      <path d="M595 136h2538" />
      <path d="M237 249h3254" />
    </>
  );

  return (
    <div {...props}>
      <svg style={{ width: '100%' }} viewBox="0 0 3728 422" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" fillRule="evenodd" stroke={color} strokeWidth={strokeWidth}>
          {vLine}
          {hLine}
        </g>
      </svg>
    </div>
  );
});

export default Grid;
