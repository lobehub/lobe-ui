import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar, responsive }) => ({
  code: css`
    overflow: auto;
    min-inline-size: 0;
    min-block-size: var(--code-showcase-min-height);
  `,
  panes: css`
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;

    ${responsive.mobile} {
      grid-template-columns: 1fr;
    }
  `,
  preview: css`
    display: flex;
    align-items: center;
    justify-content: center;

    min-inline-size: 0;
    min-block-size: var(--code-showcase-min-height);
    padding: 20px;
    border: 1px solid ${cssVar.colorBorderSecondary};
    border-radius: ${cssVar.borderRadiusLG};

    background: color-mix(in srgb, ${cssVar.colorBgContainer} 62%, transparent);
    box-shadow: ${cssVar.boxShadowTertiary};

    > * {
      max-inline-size: 100%;
    }
  `,
  root: css`
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: stretch;
  `,
  tabs: css`
    align-self: center;
    max-inline-size: 100%;
  `,
}));
