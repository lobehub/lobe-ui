import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token, prefixCls, responsive }) => ({
  form: css`
    position: relative;

    display: flex;
    flex-direction: column;
    gap: 16px;

    width: 100%;

    ${responsive.mobile} {
      gap: 0;
    }

    .${prefixCls}-form-item {
      margin: 0 !important;
    }

    .${prefixCls}-form-item .${prefixCls}-form-item-label > label {
      height: unset;
    }

    .${prefixCls}-row {
      position: relative;
      flex-wrap: nowrap;
    }

    .${prefixCls}-form-item-label {
      position: relative;
      flex: 1;
      max-width: 100%;
    }

    .${prefixCls}-form-item-row {
      align-items: center;
    }

    .${prefixCls}-form-item-control {
      position: relative;

      display: flex;
      flex: 0;
      align-items: center;

      min-width: unset !important;
    }

    .${prefixCls}-collapse-item {
      overflow: hidden !important;
      border-radius: ${token.borderRadius}px !important;
    }
  `,
}));
