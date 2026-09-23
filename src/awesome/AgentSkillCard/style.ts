import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  agent: css`
    display: inline-flex;
    flex: none;
    border-radius: 8px;
    transition: transform 140ms ease;

    &:hover {
      transform: translateY(-2px);
    }

    @media (prefers-reduced-motion: reduce) {
      &:hover {
        transform: none;
      }
    }
  `,
  agents: css`
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    justify-content: center;
  `,
  code: css`
    inline-size: 100%;
    text-align: start;
  `,
  description: css`
    margin: 0;

    font-size: 15px;
    font-weight: 500;
    line-height: 1.5;
    color: ${cssVar.colorText};
    text-align: center;
    text-wrap: balance;
  `,
  footer: css`
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    justify-content: center;

    font-size: ${cssVar.fontSizeSM};
    color: ${cssVar.colorTextTertiary};

    a {
      color: inherit;
      text-decoration: none;
    }

    a:hover {
      color: ${cssVar.colorText};
    }
  `,
  panel: css`
    display: flex;
    flex-direction: column;
    gap: 16px;
  `,
  root: css`
    display: flex;
    flex-direction: column;
    gap: 20px;

    inline-size: 100%;
    max-inline-size: 480px;
    padding-block: 12px 16px;
    padding-inline: 12px;
    border: 1px solid ${cssVar.colorBorderSecondary};
    border-radius: 16px;

    background: color-mix(in srgb, ${cssVar.colorBgElevated} 25%, transparent);
    backdrop-filter: blur(12px);
    box-shadow:
      0 1px 2px rgb(0 0 0 / 4%),
      0 12px 32px rgb(0 0 0 / 6%);
  `,
}));
