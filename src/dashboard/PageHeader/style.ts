import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar, responsive }) => ({
  actions: css`
    display: flex;
    flex: none;
    gap: 8px;
    align-items: center;

    ${responsive.mobile} {
      inline-size: 100%;

      button,
      a {
        min-block-size: 44px;
      }
    }
  `,
  description: css`
    max-inline-size: 68ch;
    line-height: 1.6;
    color: ${cssVar.colorTextSecondary};
  `,
  root: css`
    display: flex;
    gap: 16px;
    align-items: flex-start;
    justify-content: space-between;

    inline-size: 100%;
    min-inline-size: 0;

    ${responsive.mobile} {
      flex-direction: column;
      align-items: stretch;
    }
  `,
  title: css`
    margin: 0;
    font-size: ${cssVar.fontSizeHeading3};
    line-height: ${cssVar.lineHeightHeading3};
  `,
}));
