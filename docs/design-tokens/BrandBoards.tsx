import { cssVar } from '@lobehub/ui';

import { Board, CardGrid, Label, Split, ThemePair, useTokens, varName } from './primitives';
import { hueKeys, primaryTokens, shadowTokens } from './tokens';

export const ShadowBoard = () => (
  <Board>
    <CardGrid preview="shadow" specs={shadowTokens} />
    <ThemePair style={{ minHeight: 380 }}>
      {() => (
        <>
          <div
            style={{
              alignSelf: 'flex-start',
              background: cssVar.colorFillTertiary,
              borderRadius: 10,
              display: 'flex',
              gap: 4,
              padding: 4,
            }}
          >
            <span
              className="dt-menu-item"
              style={{ background: cssVar.colorBgElevated, boxShadow: cssVar.boxShadowTertiary }}
            >
              Active tab
            </span>
            <span className="dt-menu-item" style={{ color: cssVar.colorTextSecondary }}>
              Other
            </span>
          </div>
          <Label>Tabs · boxShadowTertiary</Label>
          <div className="dt-menu" style={{ width: 200 }}>
            <span className="dt-menu-item" style={{ background: cssVar.colorFillTertiary }}>
              Rename
            </span>
            <span className="dt-menu-item">Duplicate</span>
            <span className="dt-menu-item">Archive</span>
          </div>
          <Label>Menu · boxShadowSecondary</Label>
          <div
            style={{
              background: cssVar.colorBgElevated,
              borderRadius: 12,
              boxShadow: cssVar.boxShadow,
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              insetBlockEnd: 20,
              insetInlineEnd: 20,
              padding: 16,
              position: 'absolute',
              width: 200,
            }}
          >
            <span style={{ fontWeight: 600 }}>Modal</span>
            <Label>boxShadow</Label>
          </div>
        </>
      )}
    </ThemePair>
  </Board>
);

const Checkbox = () => (
  <span
    style={{
      alignItems: 'center',
      background: cssVar.colorPrimary,
      borderRadius: 4,
      color: cssVar.colorBgContainer,
      display: 'inline-flex',
      fontSize: 11,
      height: 16,
      justifyContent: 'center',
      width: 16,
    }}
  >
    ✓
  </span>
);

export const PrimaryBoard = () => (
  <Board>
    <CardGrid preview="color" specs={primaryTokens} />
    <ThemePair onContainer>
      {() => (
        <>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {(['colorPrimary', 'colorPrimaryHover', 'colorPrimaryActive'] as const).map((key) => (
              <span
                className="dt-button"
                key={key}
                style={{ background: cssVar[key], color: cssVar.colorBgContainer }}
              >
                {key.replace('colorPrimary', '') || 'Default'}
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span className="dt-menu-item">Overview</span>
            <span
              className="dt-menu-item"
              style={{
                alignItems: 'center',
                background: cssVar.colorPrimaryBg,
                boxShadow: `inset 0 0 0 1px ${cssVar.colorPrimaryBorder}`,
                display: 'flex',
                gap: 8,
              }}
            >
              <Checkbox /> Selected · colorPrimaryBg + Border
            </span>
          </div>
          <span style={{ fontSize: 13 }}>
            Read the <span style={{ color: cssVar.colorLink }}>migration guide</span> before you
            upgrade.
          </span>
        </>
      )}
    </ThemePair>
  </Board>
);

export const HueBoard = () => {
  const tokens = useTokens();
  return (
    <Board>
      <div className="dt-grid" data-dense="">
        {hueKeys.map((key) => (
          <div className="dt-card" key={key}>
            <Split>{() => <div className="dt-swatch" style={{ background: cssVar[key] }} />}</Split>
            <div className="dt-meta">
              <div className="dt-name">{key}</div>
              <div className="dt-mono">{varName(key)}</div>
              <div className="dt-mono" data-strong="">
                {tokens.light[key] === tokens.dark[key]
                  ? String(tokens.light[key])
                  : `${tokens.light[key]} · ${tokens.dark[key]}`}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Board>
  );
};
