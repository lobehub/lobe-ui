import { cssVar, ThemeScope, useTheme } from '@lobehub/ui';
import type { CSSProperties, ReactNode } from 'react';

import { hueKeys } from './tokens';
import { appearances } from './TokenTable';

const mono: CSSProperties = { fontFamily: cssVar.fontFamilyCode, fontSize: 11 };

const columns: CSSProperties = { display: 'flex', flexWrap: 'wrap', gap: 16, marginBlock: 16 };

const Label = ({ children }: { children: ReactNode }) => (
  <span style={{ ...mono, color: cssVar.colorTextTertiary }}>{children}</span>
);

export const SurfaceScene = () => (
  <div style={columns}>
    {appearances.map((appearance) => (
      <ThemeScope
        appearance={appearance}
        key={appearance}
        style={{
          background: cssVar.colorBgLayout,
          border: `1px solid ${cssVar.colorBorderSecondary}`,
          borderRadius: 12,
          color: cssVar.colorText,
          display: 'flex',
          flex: '1 1 340px',
          flexDirection: 'column',
          gap: 10,
          minWidth: 0,
          padding: 16,
        }}
      >
        <Label>{`${appearance} · colorBgLayout`}</Label>
        <div
          style={{
            background: cssVar.colorBgContainer,
            border: `1px solid ${cssVar.colorBorderSecondary}`,
            borderRadius: cssVar.borderRadiusLG,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            padding: 16,
            position: 'relative',
          }}
        >
          <Label>colorBgContainer · colorBorderSecondary</Label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: cssVar.fontSizeLG, fontWeight: 600 }}>Workspace</span>
            <span style={{ color: cssVar.colorTextSecondary }}>Members and permissions</span>
            <span style={{ color: cssVar.colorTextTertiary, fontSize: cssVar.fontSizeSM }}>
              Updated 2 min ago
            </span>
          </div>
          <div
            style={{
              border: `1px solid ${cssVar.colorBorder}`,
              borderRadius: cssVar.borderRadius,
              color: cssVar.colorTextQuaternary,
              padding: '5px 11px',
            }}
          >
            Search members
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['colorFillTertiary', 'colorFillSecondary', 'colorFill'] as const).map((key) => (
              <span
                key={key}
                style={{
                  ...mono,
                  background: cssVar[key],
                  borderRadius: cssVar.borderRadiusSM,
                  color: cssVar.colorTextSecondary,
                  padding: '2px 8px',
                }}
              >
                {key.replace('color', '')}
              </span>
            ))}
          </div>
          <div
            style={{
              alignSelf: 'flex-end',
              background: cssVar.colorBgElevated,
              borderRadius: cssVar.borderRadiusLG,
              boxShadow: cssVar.boxShadowSecondary,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              marginBlockStart: -4,
              padding: 6,
              width: 200,
            }}
          >
            <Label>colorBgElevated · boxShadowSecondary</Label>
            {['Rename', 'Duplicate'].map((item, i) => (
              <span
                key={item}
                style={{
                  background: i === 0 ? cssVar.colorFillTertiary : undefined,
                  borderRadius: cssVar.borderRadiusSM,
                  padding: '4px 8px',
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </ThemeScope>
    ))}
  </div>
);

const HueRow = () => {
  const theme = useTheme();
  return (
    <div
      style={{
        display: 'grid',
        gap: 8,
        gridTemplateColumns: 'repeat(auto-fill, minmax(64px, 1fr))',
      }}
    >
      {hueKeys.map((key) => (
        <span key={key} style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
          <span style={{ background: cssVar[key], borderRadius: 6, height: 28 }} />
          <code style={{ ...mono, color: cssVar.colorText }}>{key}</code>
          <span style={{ ...mono, color: cssVar.colorTextTertiary }}>{String(theme[key])}</span>
        </span>
      ))}
    </div>
  );
};

export const HueScene = () => (
  <div style={columns}>
    {appearances.map((appearance) => (
      <ThemeScope
        appearance={appearance}
        key={appearance}
        style={{
          background: cssVar.colorBgContainer,
          border: `1px solid ${cssVar.colorBorderSecondary}`,
          borderRadius: 12,
          display: 'flex',
          flex: '1 1 340px',
          flexDirection: 'column',
          gap: 12,
          minWidth: 0,
          padding: 16,
        }}
      >
        <Label>{appearance}</Label>
        <HueRow />
      </ThemeScope>
    ))}
  </div>
);
