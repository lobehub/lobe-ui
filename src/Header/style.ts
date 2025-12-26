import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar, responsive }) => ({
  left: css`
    z-index: 10;
  `,
  right: css`
    z-index: 10;

    &-aside {
      display: flex;
      align-items: center;

      ${responsive.sm} {
        justify-content: center;

        margin-block: 8px;
        margin-inline: 16px;
        padding-block-start: 24px;
        border-block-start: 1px solid ${cssVar.colorBorder};
      }
    }
  `,
  root: css`
    grid-area: head;
    align-self: stretch;

    width: 100%;
    height: 64px;
    padding-block: 0;
    padding-inline: 24px;
    border-block-end: 1px solid ${cssVar.colorBorderSecondary};

    background-color: color-mix(in srgb, ${cssVar.colorBgLayout} 40%, transparent);

    ${responsive.sm} {
      padding-block: 0;
      padding-inline: 12px;
    }
  `,
}));
