import { cssVar } from '@lobehub/ui';
import { useState } from 'react';

import { Board, formatValue, useTokens, varName } from './primitives';
import { durationTokens, easingTokens, springTokens, type TokenKey } from './tokens';

const PLAY_DURATION = 600;
const W = 200;
const H = 110;

const curvePath = (value: string) => {
  const bezier = value.match(/cubic-bezier\(([^)]*)\)/);
  if (bezier) {
    const [x1, y1, x2, y2] = bezier[1].split(',').map(Number);
    return `M0 ${H} C${x1 * W} ${H - y1 * H} ${x2 * W} ${H - y2 * H} ${W} 0`;
  }
  const linear = value.match(/linear\(([^)]*)\)/);
  if (!linear) return '';
  const points = linear[1].split(',').map(Number);
  return points
    .map((y, i) => `${i === 0 ? 'M' : 'L'}${(i / (points.length - 1)) * W} ${H - y * H}`)
    .join(' ');
};

const EasingCard = ({
  detail,
  played,
  role,
  tokenKey,
  value,
}: {
  detail?: string;
  played: boolean;
  role: string;
  tokenKey: TokenKey;
  value: string;
}) => (
  <div className="dt-card">
    <div
      style={{
        alignItems: 'center',
        background: cssVar.colorFillQuaternary,
        display: 'flex',
        height: 150,
        justifyContent: 'center',
      }}
    >
      <svg
        aria-label={`${tokenKey} curve`}
        height="140"
        role="img"
        viewBox="-8 -22 216 150"
        width="216"
      >
        <path d={`M0 0 L${W} 0`} fill="none" stroke={cssVar.colorBorder} strokeDasharray="4 4" />
        <path d={`M0 ${H} L${W} ${H}`} fill="none" stroke={cssVar.colorBorderSecondary} />
        <path
          d={curvePath(value)}
          fill="none"
          stroke={cssVar.colorText}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
        />
      </svg>
    </div>
    <div className="dt-meta">
      <div className="dt-name">{tokenKey}</div>
      <div className="dt-mono">{varName(tokenKey)}</div>
      {detail && (
        <div className="dt-mono" data-strong="">
          {detail}
        </div>
      )}
      <div className="dt-role">{role}</div>
      <div className="dt-track">
        <span
          className="dt-dot"
          style={{
            insetInlineStart: played ? 'calc(100% - 31px)' : 5,
            transition: `inset-inline-start ${PLAY_DURATION}ms ${value}`,
          }}
        />
      </div>
    </div>
  </div>
);

export const MotionBoard = () => {
  const tokens = useTokens();
  const [played, setPlayed] = useState(false);

  return (
    <Board>
      <button className="dt-play" type="button" onClick={() => setPlayed((value) => !value)}>
        {played ? 'Play back' : 'Play'}
      </button>
      <div className="dt-grid">
        {easingTokens.map(({ key, role }) => (
          <EasingCard
            detail={String(tokens.light[key])}
            key={key}
            played={played}
            role={role}
            tokenKey={key}
            value={String(tokens.light[key])}
          />
        ))}
        {springTokens.map(({ key, overshoot, role, zeta }) => (
          <EasingCard
            detail={`ζ ${zeta} · overshoot ${overshoot}`}
            key={key}
            played={played}
            role={role}
            tokenKey={key}
            value={String(tokens.light[key])}
          />
        ))}
      </div>
      <div className="dt-grid">
        {durationTokens.map((key) => {
          const seconds = Number.parseFloat(String(tokens.light[key]));
          return (
            <div className="dt-card" key={key}>
              <div className="dt-meta" style={{ gap: 8 }}>
                <div className="dt-name">
                  <span>{key}</span>
                  <span className="dt-chip">{formatValue(tokens.light[key])}</span>
                </div>
                <div className="dt-mono">{varName(key)}</div>
                <div className="dt-bar" style={{ background: cssVar.colorFillTertiary }}>
                  <div
                    className="dt-bar"
                    style={{ background: cssVar.colorText, width: `${(seconds / 0.3) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Board>
  );
};
