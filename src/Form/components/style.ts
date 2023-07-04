import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
  footer: css`
    display: flex;
    gap: 8px;
    justify-content: flex-end;
  `,
  formTitle: css`
    position: relative;

    display: flex;
    flex-direction: column;
    gap: 4px;

    text-align: left;

    > div {
      font-weight: 500;
      line-height: 1;
    }

    > small {
      display: block;

      line-height: 1.1;
      color: ${token.colorTextDescription};
      word-wrap: break-word;
      white-space: pre-wrap;
    }
  `,
  group: css`
    .ant-collapse-header {
      background: ${token.colorFillTertiary};
      border-radius: 0 !important;
    }

    .ant-collapse-content {
      background: transparent;
    }

    .ant-collapse-content-box {
      padding-top: 0 !important;
      padding-bottom: 0 !important;
    }
  `,
  item: css`
    padding: 8px 0;

    .ant-row {
      justify-content: space-between;

      > div {
        flex: unset !important;
        flex-grow: unset !important;
      }
    }
  `,
  title: css`
    display: flex;
    gap: 8px;
    align-items: center;

    font-size: 16px;
    font-weight: 600;

    .anticon {
      color: ${token.colorPrimary};
    }
  `,
}));
