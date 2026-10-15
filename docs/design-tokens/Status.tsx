import { Alert, cssVar, Tag, ThemeScope, useTheme } from '@lobehub/ui';
import type { CSSProperties } from 'react';

import { statusRoles, type StatusType, statusTypes, type TokenKey } from './tokens';
import { appearances, contrast } from './TokenTable';

const mono: CSSProperties = { fontFamily: cssVar.fontFamilyCode, fontSize: 11 };

const statusKey = (status: StatusType, suffix: string) => `color${status}${suffix}` as TokenKey;

const copy: Record<StatusType, [string, string]> = {
  Error: ['Name is required', 'Enter a workspace name to continue.'],
  Info: ['Synced 2 min ago', 'Changes from other devices are merged.'],
  Success: ['Saved', 'Your settings are up to date.'],
  Warning: ['Quota at 90%', 'Requests slow down after the limit.'],
};

const Matrix = () => {
  const theme = useTheme();
  return (
    <div
      style={{
        display: 'grid',
        gap: 6,
        gridTemplateColumns: 'minmax(128px, 1.3fr) repeat(4, minmax(0, 1fr))',
      }}
    >
      <span />
      {statusTypes.map((status) => (
        <span key={status} style={{ ...mono, color: cssVar.colorTextTertiary }}>
          {status.toLowerCase()}
        </span>
      ))}
      {statusRoles.map(({ role, suffix }) => (
        <MatrixRow key={suffix} role={role} suffix={suffix} theme={theme} />
      ))}
    </div>
  );
};

const MatrixRow = ({
  role,
  suffix,
  theme,
}: {
  role: string;
  suffix: string;
  theme: ReturnType<typeof useTheme>;
}) => (
  <>
    <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      <code style={{ ...mono, color: cssVar.colorText }}>{`color*${suffix}`}</code>
      <span style={{ color: cssVar.colorTextTertiary, fontSize: 12 }}>{role}</span>
    </span>
    {statusTypes.map((status) => {
      const key = statusKey(status, suffix);
      const value = String(theme[key]);
      const ratio =
        suffix === 'Text' || suffix === '' ? contrast(value, theme.colorBgContainer) : 0;
      return (
        <span
          key={status}
          style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}
        >
          <span
            title={`${key}: ${value}`}
            style={{
              background: cssVar[key],
              borderRadius: 6,
              boxShadow: `inset 0 0 0 1px ${cssVar.colorFillTertiary}`,
              height: 24,
            }}
          />
          <span
            style={{
              ...mono,
              color: cssVar.colorTextSecondary,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {value.startsWith('#') ? value : 'rgba'}
          </span>
          {ratio ? (
            <span
              style={{ ...mono, color: cssVar.colorTextTertiary }}
            >{`${ratio.toFixed(1)}:1`}</span>
          ) : null}
        </span>
      );
    })}
  </>
);

const panel: CSSProperties = {
  background: cssVar.colorBgContainer,
  border: `1px solid ${cssVar.colorBorderSecondary}`,
  borderRadius: 12,
  color: cssVar.colorText,
  display: 'flex',
  flex: '1 1 340px',
  flexDirection: 'column',
  gap: 12,
  minWidth: 0,
  padding: 16,
};

const columns: CSSProperties = { display: 'flex', flexWrap: 'wrap', gap: 16, marginBlock: 16 };

export const StatusMatrix = () => (
  <div style={columns}>
    {appearances.map((appearance) => (
      <ThemeScope appearance={appearance} key={appearance} style={panel}>
        <span style={{ ...mono, color: cssVar.colorTextTertiary, fontSize: 12 }}>{appearance}</span>
        <Matrix />
      </ThemeScope>
    ))}
  </div>
);

export const StatusScene = () => (
  <div style={columns}>
    {appearances.map((appearance) => (
      <ThemeScope appearance={appearance} key={appearance} style={panel}>
        <span style={{ ...mono, color: cssVar.colorTextTertiary, fontSize: 12 }}>{appearance}</span>
        {statusTypes.map((status) => (
          <Alert
            showIcon
            description={copy[status][1]}
            key={status}
            title={copy[status][0]}
            type={status.toLowerCase() as Lowercase<StatusType>}
          />
        ))}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {statusTypes.map((status) => (
            <Tag color={status.toLowerCase()} key={status}>
              {status}
            </Tag>
          ))}
        </div>
      </ThemeScope>
    ))}
  </div>
);
