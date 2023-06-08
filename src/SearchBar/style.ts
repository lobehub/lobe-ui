import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
  search: css`
    position: relative;
    max-width: 100%;

    .ant-input-affix-wrapper {
      &:hover {
        border-color: ${token.colorBorder};
      }
    }

    .ant-input-affix-wrapper-focused {
      border-color: ${token.colorTextQuaternary};

      &:hover {
        border-color: ${token.colorTextQuaternary};
      }
    }
  `,
  input: css`
    position: relative;
    padding: 0 8px 0 12px;
  `,
  tag: css`
    pointer-events: none;

    position: absolute;
    z-index: 5;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
  `,

  icon: css`
    color: ${token.colorTextPlaceholder};
  `,
}));
