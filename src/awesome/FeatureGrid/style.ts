import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar, responsive }) => ({
  description: css`
    margin: 0;

    font-size: 13.5px;
    line-height: 1.65;
    color: ${cssVar.colorTextSecondary};
    text-wrap: pretty;
  `,
  grid: css`
    display: grid;
    grid-template-columns: repeat(var(--feature-grid-columns), minmax(0, 1fr));
    gap: 16px;

    ${responsive.tablet} {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    ${responsive.mobile} {
      grid-template-columns: 1fr;
    }
  `,
  icon: css`
    display: flex;
    align-items: center;
    justify-content: center;

    inline-size: 30px;
    block-size: 30px;
    margin-block-end: 14px;
    border-radius: 9px;

    color: ${cssVar.colorPrimary};

    background: ${cssVar.colorPrimaryBg};
  `,
  item: css`
    display: block;

    padding-block: 20px 22px;
    padding-inline: 20px;
    border: 1px solid ${cssVar.colorBorderSecondary};
    border-radius: ${cssVar.borderRadiusLG};

    color: inherit;
    text-decoration: none;

    background: color-mix(in srgb, ${cssVar.colorBgElevated} 25%, transparent);
    box-shadow: ${cssVar.boxShadowTertiary};

    transition:
      border-color 140ms ease,
      box-shadow 140ms ease;

    &:hover {
      border-color: ${cssVar.colorBorder};
      box-shadow: ${cssVar.boxShadowSecondary};
    }
  `,
  title: css`
    margin-block: 0 6px;
    margin-inline: 0;

    font-size: 15px;
    font-weight: 600;
    color: ${cssVar.colorText};
    letter-spacing: -0.01em;
  `,
}));
