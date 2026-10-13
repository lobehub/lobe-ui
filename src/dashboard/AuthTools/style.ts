import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  locale: css`
    && {
      inline-size: fit-content;
      min-inline-size: 120px;
      block-size: 28px;
      border-radius: 28px;

      background: ${cssVar.colorBgLayout};
    }
  `,
  localeIcon: css`
    margin-inline-end: 2px;
  `,
  theme: css`
    && {
      block-size: 28px;
      padding: 2px;
      border-radius: 28px;
    }
  `,
  themeIcon: css`
    inline-size: 16px;
    block-size: 16px;
  `,
  themeIndicator: css`
    && {
      border-radius: 22px;
    }
  `,
  themeItem: css`
    && {
      block-size: 22px;
      padding-inline: 8px;
      border-radius: 22px;
    }
  `,
  themeLabel: css`
    position: absolute;

    overflow: hidden;

    inline-size: 1px;
    block-size: 1px;
    padding: 0;
    border: 0;

    white-space: nowrap;

    clip-path: inset(50%);
  `,
  toolRow: css`
    display: flex;
    gap: 8px;
    align-items: center;
  `,
}));
