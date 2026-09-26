import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  bordered: css`
    gap: 0;
    border: 1px solid ${cssVar.colorBorderSecondary};
    border-block-start: 0;
    border-radius: ${cssVar.borderRadius};

    & > dt,
    & > dd {
      padding-block: 8px;
      padding-inline: 12px;
      border-block-start: 1px solid ${cssVar.colorBorderSecondary};
    }

    & > dt {
      border-inline-end: 1px solid ${cssVar.colorBorderSecondary};
      background: ${cssVar.colorFillQuaternary};
    }
  `,
  content: css`
    min-width: 0;
    margin: 0;
    color: ${cssVar.colorText};
    overflow-wrap: anywhere;
  `,
  extra: css`
    flex: none;
  `,
  header: css`
    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: space-between;

    margin-block-end: 8px;
  `,
  label: css`
    color: ${cssVar.colorTextDescription};
    white-space: nowrap;
  `,
  list: css`
    display: grid;
    gap: 6px 12px;

    margin: 0;

    font-size: 13px;
    line-height: 1.5;
  `,
  root: css`
    min-width: 0;
  `,
  title: css`
    font-size: 14px;
    font-weight: 600;
    color: ${cssVar.colorText};
  `,
}));
