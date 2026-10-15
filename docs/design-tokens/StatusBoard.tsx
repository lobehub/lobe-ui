import { cssVar, type LobeAppearance, type LobeToken, ThemeScope } from '@lobehub/ui';

import { appearances, Board, formatValue, ThemePair, useTokens } from './primitives';
import { statusKey, statusRoles, type StatusType, statusTypes, type TokenKey } from './tokens';

const copy: Record<StatusType, string> = {
  Error: 'Name is required',
  Info: 'Synced 2 min ago',
  Success: 'Settings saved',
  Warning: 'Quota at 90%',
};

const channel = (value: number) => {
  const c = value / 255;
  return c <= 0.040_45 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

const luminance = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => channel(Number.parseInt(hex.slice(i, i + 2), 16)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrast = (color: string, background: string) => {
  if (!/^#[\da-f]{6}$/i.test(color) || !/^#[\da-f]{6}$/i.test(background)) return '';
  const [x, y] = [luminance(color), luminance(background)];
  return `${((Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)).toFixed(1)}:1`;
};

const short = (value: unknown) => {
  const text = formatValue(value);
  return text.startsWith('rgba') ? 'rgba' : text;
};

const Cell = ({
  showContrast,
  tokenKey,
  tokens,
}: {
  showContrast: boolean;
  tokenKey: TokenKey;
  tokens: Record<LobeAppearance, LobeToken>;
}) => (
  <div className="dt-matrix-cell">
    <div className="dt-mini">
      {appearances.map((appearance) => (
        <ThemeScope appearance={appearance} key={appearance}>
          <div className="dt-swatch" style={{ background: cssVar[tokenKey], borderRadius: 4 }} />
        </ThemeScope>
      ))}
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
      <span className="dt-mono" data-strong="">
        {`${short(tokens.light[tokenKey])} · ${short(tokens.dark[tokenKey])}`}
      </span>
      {showContrast && (
        <span className="dt-mono">
          {`${contrast(String(tokens.light[tokenKey]), tokens.light.colorBgContainer)} · ${contrast(
            String(tokens.dark[tokenKey]),
            tokens.dark.colorBgContainer,
          )}`}
        </span>
      )}
    </div>
  </div>
);

const Matrix = () => {
  const tokens = useTokens();
  return (
    <div className="dt-matrix">
      <div className="dt-matrix-row">
        <div className="dt-matrix-cell dt-label">role</div>
        {statusTypes.map((status) => (
          <div className="dt-matrix-cell" key={status} style={{ fontWeight: 600 }}>
            {status}
          </div>
        ))}
      </div>
      {statusRoles.map(({ label, role, suffix }) => (
        <div className="dt-matrix-row" key={label}>
          <div
            className="dt-matrix-cell"
            style={{ alignItems: 'flex-start', flexDirection: 'column', gap: 2 }}
          >
            <span className="dt-name">{label}</span>
            <span className="dt-role">{role}</span>
          </div>
          {statusTypes.map((status) => (
            <Cell
              key={status}
              showContrast={suffix === '' || suffix === 'Text'}
              tokenKey={statusKey(status, suffix)}
              tokens={tokens}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

const AlertIcon = ({ color }: { color: string }) => (
  <svg
    aria-hidden="true"
    fill="none"
    height="16"
    stroke={color}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    style={{ flex: 'none', marginBlockStart: 2 }}
    viewBox="0 0 24 24"
    width="16"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v5" />
    <path d="M12 16h.01" />
  </svg>
);

const Scene = () => (
  <>
    {statusTypes.map((status) => (
      <div
        key={status}
        style={{
          background: cssVar[statusKey(status, 'Bg')],
          border: `1px solid ${cssVar[statusKey(status, 'Border')]}`,
          borderRadius: 10,
          display: 'flex',
          gap: 10,
          padding: '10px 12px',
        }}
      >
        <AlertIcon color={cssVar[statusKey(status, '')]} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ color: cssVar[statusKey(status, 'Text')], fontWeight: 600 }}>
            {copy[status]}
          </span>
          <span className="dt-label">{`${status}Bg · ${status}Border · ${status}Text`}</span>
        </div>
      </div>
    ))}
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {statusTypes.map((status) => (
        <span
          key={status}
          style={{
            background: cssVar[statusKey(status, 'FillTertiary')],
            borderRadius: 6,
            color: cssVar[statusKey(status, 'Text')],
            fontSize: 12,
            padding: '2px 8px',
          }}
        >
          {status}
        </span>
      ))}
    </div>
    <div
      style={{
        background: cssVar.colorErrorBg,
        border: `1px solid ${cssVar.colorErrorBorderHover}`,
        borderRadius: 8,
        padding: '7px 12px',
      }}
    >
      Input error · ErrorBg + ErrorBorderHover
    </div>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {(['', 'Hover', 'Active'] as const).map((suffix) => (
        <span
          className="dt-button"
          key={suffix}
          style={{
            background: cssVar[statusKey('Error', suffix)],
            color: cssVar.colorTextLightSolid,
          }}
        >
          {`Delete${suffix ? ` · ${suffix}` : ''}`}
        </span>
      ))}
    </div>
  </>
);

export const StatusBoard = () => (
  <Board>
    <Matrix />
    <ThemePair onContainer>{() => <Scene />}</ThemePair>
  </Board>
);
