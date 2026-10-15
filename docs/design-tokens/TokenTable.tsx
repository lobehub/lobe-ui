import { cssVar, type LobeAppearance, ThemeScope, useTheme } from '@lobehub/ui';
import type { CSSProperties, ReactNode } from 'react';

import type { TokenGroup, TokenKey, TokenPreview, TokenRow } from './tokens';

export const appearances: LobeAppearance[] = ['light', 'dark'];

const mono: CSSProperties = {
  fontFamily: cssVar.fontFamilyCode,
  fontSize: 12,
  lineHeight: 1.5,
};

export const varName = (key: TokenKey) => String(cssVar[key]).replace(/^var\((.*)\)$/, '$1');

export const formatValue = (value: unknown) =>
  typeof value === 'number' ? `${value}px` : String(value);

const channel = (value: number) => {
  const c = value / 255;
  return c <= 0.040_45 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

const luminance = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => channel(Number.parseInt(hex.slice(i, i + 2), 16)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const contrast = (a: string, b: string) => {
  if (!/^#[\da-f]{6}$/i.test(a) || !/^#[\da-f]{6}$/i.test(b)) return;
  const [x, y] = [luminance(a), luminance(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};

export const Cell = ({
  appearance,
  children,
  style,
}: {
  appearance: LobeAppearance;
  children: ReactNode;
  style?: CSSProperties;
}) => (
  <ThemeScope
    appearance={appearance}
    style={{
      alignItems: 'center',
      background: cssVar.colorBgContainer,
      color: cssVar.colorText,
      display: 'flex',
      gap: 12,
      minWidth: 0,
      padding: '12px 14px',
      ...style,
    }}
  >
    {children}
  </ThemeScope>
);

const swatch: CSSProperties = {
  borderRadius: 6,
  flex: 'none',
  height: 28,
  width: 28,
};

const Value = ({ children }: { children: ReactNode }) => (
  <span
    style={{
      ...mono,
      color: cssVar.colorTextSecondary,
      minWidth: 0,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    }}
  >
    {children}
  </span>
);

const Preview = ({ preview, tokenKey }: { preview: TokenPreview; tokenKey: TokenKey }) => {
  const theme = useTheme();
  const value = theme[tokenKey];
  const css = cssVar[tokenKey];

  switch (preview) {
    case 'text': {
      const ratio = contrast(String(value), theme.colorBgContainer);
      return (
        <>
          <span style={{ color: css, flex: 'none', fontSize: 15, fontWeight: 500 }}>Aa</span>
          <Value>
            {formatValue(value)}
            {ratio ? ` · ${ratio.toFixed(1)}:1` : ''}
          </Value>
        </>
      );
    }
    case 'shadow': {
      return (
        <span
          style={{
            ...swatch,
            background: cssVar.colorBgElevated,
            boxShadow: css,
            height: 40,
            margin: 8,
            width: 72,
          }}
        />
      );
    }
    case 'radius': {
      return (
        <>
          <span
            style={{
              ...swatch,
              background: cssVar.colorFillSecondary,
              border: `1px solid ${cssVar.colorBorder}`,
              borderRadius: css,
              width: 44,
            }}
          />
          <Value>{formatValue(value)}</Value>
        </>
      );
    }
    case 'font': {
      return (
        <>
          <span style={{ flex: 'none', fontFamily: css, fontSize: 15 }}>Ag 0123</span>
          <Value>{String(value)}</Value>
        </>
      );
    }
    case 'fontSize': {
      return (
        <>
          <span style={{ flex: 'none', fontSize: css, lineHeight: 1.2 }}>Aa</span>
          <Value>{formatValue(value)}</Value>
        </>
      );
    }
    default: {
      return (
        <>
          <span
            style={{
              ...swatch,
              background: css,
              boxShadow: `inset 0 0 0 1px ${cssVar.colorBorderSecondary}`,
            }}
          />
          <Value>{formatValue(value)}</Value>
        </>
      );
    }
  }
};

export const TokenName = ({
  alias,
  role,
  tokenKey,
}: Omit<TokenRow, 'key'> & { tokenKey: TokenKey }) => (
  <div
    style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0, padding: '12px 14px' }}
  >
    <code style={{ ...mono, color: cssVar.colorText, fontSize: 13, fontWeight: 500 }}>
      {tokenKey}
    </code>
    <span style={{ ...mono, color: cssVar.colorTextTertiary }}>{varName(tokenKey)}</span>
    <span style={{ color: cssVar.colorTextSecondary, fontSize: 13 }}>
      {role}
      {alias ? ` · alias of ${alias}` : ''}
    </span>
  </div>
);

export const grid: CSSProperties = {
  border: `1px solid ${cssVar.colorBorderSecondary}`,
  borderRadius: 12,
  display: 'grid',
  gap: 1,
  background: cssVar.colorBorderSecondary,
  gridTemplateColumns: 'minmax(0, 1.3fr) repeat(2, minmax(0, 1fr))',
  marginBlock: 16,
  overflow: 'hidden',
};

const head: CSSProperties = {
  ...mono,
  background: cssVar.colorFillQuaternary,
  color: cssVar.colorTextTertiary,
  padding: '8px 14px',
};

export const TokenTable = ({ group }: { group: TokenGroup }) => (
  <div style={grid}>
    <div style={{ ...head, background: cssVar.colorBgContainer }}>token</div>
    {appearances.map((appearance) => (
      <ThemeScope appearance={appearance} key={appearance} style={head}>
        {appearance}
      </ThemeScope>
    ))}
    {group.rows.map((row) => (
      <TokenRowView key={row.key} preview={group.preview} row={row} />
    ))}
  </div>
);

const TokenRowView = ({ preview, row }: { preview: TokenPreview; row: TokenRow }) => (
  <>
    <div style={{ background: cssVar.colorBgContainer }}>
      <TokenName alias={row.alias} role={row.role} tokenKey={row.key} />
    </div>
    {appearances.map((appearance) => (
      <Cell appearance={appearance} key={appearance}>
        <Preview preview={preview} tokenKey={row.key} />
      </Cell>
    ))}
  </>
);
