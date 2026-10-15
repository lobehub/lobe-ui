import { Button, cssVar, useTheme } from '@lobehub/ui';
import { type CSSProperties, useState } from 'react';

import { motionTokens } from './tokens';
import { formatValue, varName } from './TokenTable';

const mono: CSSProperties = { fontFamily: cssVar.fontFamilyCode, fontSize: 12 };

const DURATION = 600;

export const MotionScene = () => {
  const theme = useTheme();
  const [played, setPlayed] = useState(false);

  return (
    <div
      style={{
        border: `1px solid ${cssVar.colorBorderSecondary}`,
        borderRadius: 12,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        marginBlock: 16,
        padding: 16,
      }}
    >
      <div style={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <Button type="primary" onClick={() => setPlayed((value) => !value)}>
          {played ? 'Reverse' : 'Play'}
        </Button>
        <span style={{ color: cssVar.colorTextTertiary, fontSize: 13 }}>
          {`Every curve runs over ${DURATION}ms here so the shapes compare directly.`}
        </span>
      </div>
      {motionTokens.easings.map(({ key, role }) => (
        <div
          key={key}
          style={{
            alignItems: 'center',
            display: 'grid',
            gap: 12,
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.4fr)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
            <code style={{ ...mono, color: cssVar.colorText, fontWeight: 500 }}>{key}</code>
            <span style={{ ...mono, color: cssVar.colorTextTertiary }}>{varName(key)}</span>
            <span style={{ color: cssVar.colorTextSecondary, fontSize: 13 }}>{role}</span>
          </div>
          <div
            style={{
              background: cssVar.colorFillQuaternary,
              borderRadius: 999,
              height: 28,
              position: 'relative',
            }}
          >
            <span
              style={{
                background: cssVar.colorPrimary,
                borderRadius: 999,
                height: 20,
                insetBlockStart: 4,
                insetInlineStart: played ? 'calc(100% - 24px)' : 4,
                position: 'absolute',
                transition: `inset-inline-start ${DURATION}ms ${cssVar[key]}`,
                width: 20,
              }}
            />
          </div>
        </div>
      ))}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {motionTokens.durations.map((key) => (
          <span
            key={key}
            style={{
              ...mono,
              background: cssVar.colorFillTertiary,
              borderRadius: cssVar.borderRadiusSM,
              color: cssVar.colorTextSecondary,
              padding: '2px 8px',
            }}
          >
            {`${key} ${formatValue(theme[key])}`}
          </span>
        ))}
      </div>
    </div>
  );
};
