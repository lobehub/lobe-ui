import { cssVar } from '@lobehub/ui';

import { Board, CardGrid, Label, ThemePair } from './primitives';
import { borderTokens, fillTokens, surfaceTokens, textTokens } from './tokens';

const InfoIcon = ({ color }: { color: string }) => (
  <svg
    aria-hidden="true"
    fill="none"
    height="16"
    stroke={color}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width="16"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v5" />
    <path d="M12 16h.01" />
  </svg>
);

export const SurfaceBoard = () => (
  <Board>
    <CardGrid preview="surface" specs={surfaceTokens} />
    <ThemePair style={{ minHeight: 300 }}>
      {() => (
        <>
          <Label>colorBgLayout · page</Label>
          <div className="dt-panel" style={{ maxWidth: 300 }}>
            <Label>colorBgContainer · card</Label>
            <span style={{ fontSize: 15, fontWeight: 600 }}>Settings</span>
            <div className="dt-bar" style={{ width: '80%' }} />
            <div
              className="dt-bar"
              style={{ background: cssVar.colorFillTertiary, width: '64%' }}
            />
            <div
              className="dt-bar"
              style={{ background: cssVar.colorFillTertiary, width: '72%' }}
            />
          </div>
          <div
            className="dt-menu"
            style={{ insetBlockStart: 128, insetInlineEnd: 20, position: 'absolute', width: 210 }}
          >
            <span className="dt-label" style={{ padding: '6px 10px' }}>
              colorBgElevated · menu
            </span>
            <span className="dt-menu-item" style={{ background: cssVar.colorFillTertiary }}>
              Appearance
            </span>
            <span className="dt-menu-item">Data controls</span>
            <span className="dt-menu-item">Members</span>
          </div>
        </>
      )}
    </ThemePair>
    <ThemePair style={{ minHeight: 240 }}>
      {() => (
        <>
          <div className="dt-bar" style={{ width: '50%' }} />
          <div className="dt-bar" style={{ width: '70%' }} />
          <div className="dt-bar" style={{ width: '40%' }} />
          <div style={{ background: cssVar.colorBgMask, inset: 0, position: 'absolute' }} />
          <div
            style={{
              background: cssVar.colorBgElevated,
              borderRadius: 12,
              boxShadow: cssVar.boxShadow,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              insetInlineStart: '50%',
              insetBlockStart: '50%',
              padding: 18,
              position: 'absolute',
              transform: 'translate(-50%, -40%)',
              width: 260,
            }}
          >
            <span style={{ fontSize: 15, fontWeight: 600 }}>Delete workspace?</span>
            <span style={{ color: cssVar.colorTextSecondary, fontSize: 13 }}>
              colorBgElevated over colorBgMask
            </span>
          </div>
        </>
      )}
    </ThemePair>
  </Board>
);

export const TextBoard = () => (
  <Board>
    <CardGrid preview="text" specs={textTokens} />
    <ThemePair onContainer>
      {() => (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ color: cssVar.colorTextHeading, fontSize: 20, fontWeight: 600 }}>
              General
            </span>
            <span style={{ color: cssVar.colorTextDescription, fontSize: 13 }}>
              Workspace name, default locale and region
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ color: cssVar.colorTextLabel, fontSize: 13 }}>Workspace name</span>
            <div
              style={{
                border: `1px solid ${cssVar.colorBorder}`,
                borderRadius: 8,
                color: cssVar.colorTextPlaceholder,
                padding: '7px 12px',
              }}
            >
              My workspace
            </div>
          </div>
          <div style={{ alignItems: 'center', display: 'flex', gap: 8 }}>
            <InfoIcon color={cssVar.colorIcon} />
            <span style={{ color: cssVar.colorTextTertiary, fontSize: 13 }}>
              Shown to everyone you invite
            </span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <span
              className="dt-button"
              style={{ background: cssVar.colorPrimary, color: cssVar.colorBgContainer }}
            >
              Save
            </span>
            <span
              className="dt-button"
              style={{
                border: `1px solid ${cssVar.colorBorder}`,
                color: cssVar.colorTextDisabled,
              }}
            >
              Disabled
            </span>
          </div>
          <div style={{ color: cssVar.colorTextSecondary, fontSize: 12 }}>
            Home <span style={{ color: cssVar.colorTextQuaternary }}>/</span> Settings{' '}
            <span style={{ color: cssVar.colorTextQuaternary }}>/</span>{' '}
            <span style={{ color: cssVar.colorText }}>General</span>
          </div>
        </>
      )}
    </ThemePair>
  </Board>
);

export const BorderBoard = () => (
  <Board>
    <CardGrid preview="border" specs={borderTokens} />
    <ThemePair>
      {() => (
        <div className="dt-panel" style={{ gap: 0, padding: 0 }}>
          <div style={{ padding: 16 }}>
            <Label>colorBorderSecondary · card edge</Label>
          </div>
          {['Notifications', 'Language', 'Shortcuts'].map((row) => (
            <div
              key={row}
              style={{
                borderBlockStart: `1px solid ${cssVar.colorSplit}`,
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px 16px',
              }}
            >
              <span>{row}</span>
              <span className="dt-label">colorSplit</span>
            </div>
          ))}
          <div style={{ borderBlockStart: `1px solid ${cssVar.colorSplit}`, padding: 16 }}>
            <div
              style={{
                border: `1px solid ${cssVar.colorBorder}`,
                borderRadius: 8,
                color: cssVar.colorTextQuaternary,
                padding: '7px 12px',
              }}
            >
              Input · colorBorder
            </div>
          </div>
        </div>
      )}
    </ThemePair>
  </Board>
);

export const FillBoard = () => (
  <Board>
    <CardGrid preview="fill" specs={fillTokens} />
    <ThemePair onContainer>
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
              Chat
            </span>
            <span className="dt-menu-item" style={{ color: cssVar.colorTextSecondary }}>
              Files
            </span>
          </div>
          <Label>colorFillTertiary · segmented track</Label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span className="dt-menu-item">Inbox</span>
            <span className="dt-menu-item" style={{ background: cssVar.colorFillSecondary }}>
              Drafts · hover, colorFillSecondary
            </span>
            <span className="dt-menu-item" style={{ background: cssVar.colorFill }}>
              Sent · pressed, colorFill
            </span>
          </div>
          <div
            style={{
              background: cssVar.colorFillQuaternary,
              borderRadius: 8,
              fontFamily: cssVar.fontFamilyCode,
              fontSize: 12,
              padding: '10px 12px',
            }}
          >
            pnpm add @lobehub/ui · colorFillQuaternary
          </div>
        </>
      )}
    </ThemePair>
  </Board>
);
