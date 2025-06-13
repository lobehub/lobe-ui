import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
  code: css`
    font-family: ${token.fontFamilyCode};
  `,
  danger: css`
    color: ${token.colorError};
  `,
  delete: css`
    text-decoration: line-through;
  `,
  disabled: css`
    cursor: not-allowed;
    color: ${token.colorTextDisabled};
  `,
  ellipsis: css`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  ellipsisMulti: css`
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
  `,
  info: css`
    color: ${token.colorInfo};
  `,
  italic: css`
    font-style: italic;
  `,
  mark: css`
    color: #000;
    background-color: ${token.yellow};
  `,
  secondary: css`
    color: ${token.colorTextSecondary};
  `,
  strong: css`
    font-weight: bold;
  `,
  success: css`
    color: ${token.colorSuccess};
  `,
  text: css`
    font-size: ${token.fontSize}px;
    line-height: ${token.lineHeight};
    color: ${token.colorText};
  `,
  underline: css`
    text-decoration: underline;
  `,
  warning: css`
    color: ${token.colorWarning};
  `,
}));
