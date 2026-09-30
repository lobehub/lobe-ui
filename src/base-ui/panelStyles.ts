import { createStaticStyles } from 'antd-style';

import { focusRing } from '@/base-ui/focusRing';

export const panelStyles = createStaticStyles(({ css, cssVar }) => ({
  label: css`
    font-size: 10px;
    font-weight: 600;
    color: ${cssVar.colorTextTertiary};
    text-transform: uppercase;
    letter-spacing: 0.08em;
  `,
  nav: css`
    ${focusRing};
    cursor: pointer;

    display: inline-flex;
    align-items: center;
    justify-content: center;

    width: 28px;
    height: 28px;
    padding: 0;
    border: 0;
    border-radius: 50%;

    color: ${cssVar.colorTextSecondary};

    background: none;

    &:hover {
      color: ${cssVar.colorText};
      background: ${cssVar.colorFillTertiary};
    }
  `,
  pill: css`
    ${focusRing};
    cursor: pointer;

    display: inline-flex;
    gap: 6px;
    align-items: center;
    justify-content: center;

    height: 32px;
    padding-inline: 14px;
    border: 0;
    border-radius: 999px;

    font: inherit;
    font-size: 13px;
    font-weight: 500;
    color: ${cssVar.colorBgContainer};

    background: ${cssVar.colorText};
  `,
  pillGhost: css`
    color: ${cssVar.colorText};
    background: ${cssVar.colorFillTertiary};

    &:hover {
      background: ${cssVar.colorFillSecondary};
    }
  `,
  popup: css`
    padding: 16px;
    border-radius: 16px;
    background: ${cssVar.colorBgElevated};
    box-shadow: ${cssVar.boxShadow}, var(--lobe-ring);
  `,
  title: css`
    ${focusRing};
    cursor: pointer;

    padding: 0;
    border: 0;

    font: inherit;
    font-size: 22px;
    font-weight: 600;
    line-height: 1.2;
    color: ${cssVar.colorText};
    text-align: start;
    letter-spacing: -0.01em;

    background: none;
  `,
  titleMuted: css`
    font-weight: 400;
    color: ${cssVar.colorTextTertiary};
  `,
}));
