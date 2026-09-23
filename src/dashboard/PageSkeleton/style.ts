import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar, responsive }) => ({
  action: css`
    flex: none;
    inline-size: 96px;
    block-size: 32px;

    ${responsive.mobile} {
      inline-size: 100%;
      block-size: 44px;
    }
  `,
  cell: css`
    flex: none;
    inline-size: 88px;
    block-size: 14px;
  `,
  copy: css`
    flex: 1;
    min-inline-size: 0;
  `,
  header: css`
    display: flex;
    gap: 16px;
    align-items: flex-start;
    justify-content: space-between;

    ${responsive.mobile} {
      flex-direction: column;
      align-items: stretch;
    }
  `,
  headerCopy: css`
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 8px;

    min-inline-size: 0;
  `,
  page: css`
    display: flex;
    flex-direction: column;
    gap: 20px;
  `,
  row: css`
    display: flex;
    gap: 12px;
    align-items: center;

    min-block-size: 54px;
    padding-block: 12px;
    padding-inline: 16px;
    border-block-end: 1px solid ${cssVar.colorBorder};

    &:last-child {
      border-block-end: none;
    }
  `,
  srOnly: css`
    position: absolute;

    overflow: hidden;

    inline-size: 1px;
    block-size: 1px;

    white-space: nowrap;

    clip-path: inset(50%);
  `,
  statGrid: css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 12px;
  `,
  stat: css`
    display: flex;
    flex-direction: column;
    padding: 16px;
  `,
  statValue: css`
    inline-size: 42%;
    block-size: ${cssVar.fontSizeHeading2};
    margin-block: 6px 14px;
  `,
  table: css`
    overflow: hidden;
    min-inline-size: 0;
  `,
  tag: css`
    flex: none;
    inline-size: 72px;
    block-size: 22px;
    border-radius: ${cssVar.borderRadiusSM};
  `,
  thead: css`
    display: flex;
    gap: 12px;
    align-items: center;

    min-block-size: 39px;
    padding-block: 10px;
    padding-inline: 16px;

    background: ${cssVar.colorFillTertiary};
  `,
  theadCell: css`
    flex: none;
    block-size: 12px;
  `,
  title: css`
    inline-size: 220px;
    max-inline-size: 70%;
    block-size: ${cssVar.fontSizeHeading3};
  `,
}));
