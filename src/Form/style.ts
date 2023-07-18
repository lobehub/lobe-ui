import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
  footer: css`
    display: flex;
    gap: 8px;
    justify-content: flex-end;
  `,
  form: css`
    display: flex;
    flex-direction: column;
    gap: 16px;

    .ant-form-item {
      margin: 0 !important;
    }

    .ant-form-item .ant-form-item-label > label {
      height: unset;
    }

    .ant-row {
      position: relative;
      flex-wrap: nowrap;
    }

    .ant-form-item-label {
      position: relative;
      flex: 1;
      max-width: 100%;
    }

    .ant-form-item-control {
      position: relative;
      flex: 0;
      min-width: unset !important;
    }

    .ant-collapse-item {
      overflow: hidden !important;
      border-radius: ${token.borderRadius}px !important;
    }
  `,
}));
