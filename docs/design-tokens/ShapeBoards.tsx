import { cssVar } from '@lobehub/ui';

import { Board, CardGrid, Label, ThemePair } from './primitives';
import { fontFamilyTokens, fontSizeTokens, radiusTokens } from './tokens';

export const RadiusBoard = () => (
  <Board>
    <CardGrid preview="radius" specs={radiusTokens} />
    <ThemePair>
      {() => (
        <div className="dt-panel" style={{ borderRadius: cssVar.borderRadiusLG }}>
          <Label>Card · borderRadiusLG</Label>
          <div
            style={{
              border: `1px solid ${cssVar.colorBorder}`,
              borderRadius: cssVar.borderRadius,
              padding: '7px 12px',
            }}
          >
            Input · borderRadius
          </div>
          <div style={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <span
              className="dt-button"
              style={{
                background: cssVar.colorPrimary,
                borderRadius: cssVar.borderRadiusSM,
                color: cssVar.colorBgContainer,
                height: 28,
              }}
            >
              Small · borderRadiusSM
            </span>
            <span
              style={{
                background: cssVar.colorFillTertiary,
                borderRadius: cssVar.borderRadiusXS,
                fontFamily: cssVar.fontFamilyCode,
                fontSize: 12,
                padding: '2px 6px',
              }}
            >
              code · XS
            </span>
          </div>
        </div>
      )}
    </ThemePair>
  </Board>
);

export const TypographyBoard = () => (
  <Board>
    <CardGrid preview="font" specs={fontFamilyTokens} />
    <CardGrid preview="fontSize" specs={fontSizeTokens} />
    <ThemePair onContainer>
      {() => (
        <>
          <span style={{ fontSize: cssVar.fontSizeHeading2, fontWeight: 600, lineHeight: 1.27 }}>
            Heading 2
          </span>
          <span style={{ fontSize: cssVar.fontSizeHeading3, fontWeight: 600, lineHeight: 1.33 }}>
            Heading 3
          </span>
          <span style={{ fontSize: cssVar.fontSizeHeading4, fontWeight: 600 }}>Heading 4</span>
          <span style={{ fontSize: cssVar.fontSize, lineHeight: 1.6 }}>
            Body copy at fontSize. Most components size text through their own scale and read the
            body size only as a default.
          </span>
          <span style={{ color: cssVar.colorTextSecondary, fontSize: cssVar.fontSizeSM }}>
            Caption at fontSizeSM
          </span>
          <span
            style={{
              background: cssVar.colorFillQuaternary,
              borderRadius: 6,
              fontFamily: cssVar.fontFamilyCode,
              fontSize: 13,
              padding: '8px 10px',
            }}
          >
            fontFamilyCode · const answer = 42;
          </span>
        </>
      )}
    </ThemePair>
  </Board>
);
