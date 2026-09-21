import type { CSSProperties } from 'react';
import { memo } from 'react';

import { styles } from './style';

const layers = [0, 1, 2] as const;
const unit = 25;

const nodes = layers.flatMap((layer) =>
  layers.map((row) => ({ x: unit + layer * unit, y: unit + row * unit })),
);

const lines = layers.slice(0, -1).flatMap((layer) =>
  layers.flatMap((from) =>
    layers.map((to) => ({
      x1: unit + layer * unit,
      x2: unit + (layer + 1) * unit,
      y1: unit + from * unit,
      y2: unit + to * unit,
    })),
  ),
);

const particles = [0, 1, 2] as const;

const minRenderedPx = (units: number, px: number, floorPx: number) =>
  Math.max(units, (floorPx * 100) / px);

const NetworkGlyph = memo<{ px: number }>(({ px }) => {
  const boxStyle = {
    '--spin-node-size': `${minRenderedPx(6, px, 2)}px`,
    '--spin-particle-size': `${minRenderedPx(3, px, 1.5)}px`,
    'transform': `scale(${px / 100})`,
  } as CSSProperties;

  return (
    <span className={styles.network} style={{ height: px, width: px }}>
      <span className={styles.networkBox} style={boxStyle}>
        <svg className={styles.networkLines} viewBox="0 0 100 100">
          {lines.map((line) => (
            <line key={`${line.x1}-${line.y1}-${line.y2}`} {...line} />
          ))}
        </svg>
        {nodes.map(({ x, y }, index) => (
          <i
            className={styles.networkNode}
            key={`${x}-${y}`}
            style={{ animationDelay: `${index * 0.2}s`, left: x, top: y }}
          />
        ))}
        {particles.map((index) => (
          <i
            className={styles.networkParticle}
            key={index}
            style={{ animationDelay: `${index * 0.6}s` }}
          />
        ))}
        <b className={styles.networkCore} />
        <u className={styles.networkRing} />
      </span>
    </span>
  );
});

NetworkGlyph.displayName = 'NetworkGlyph';

export default NetworkGlyph;
