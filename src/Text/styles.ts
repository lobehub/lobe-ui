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
  // Heading styles
  h1: css`
    font-size: calc(${token.fontSize}px * 2.5);
    font-weight: bold;
    line-height: 1.25;
  `,

  h2: css`
    font-size: calc(${token.fontSize}px * 2);
    font-weight: bold;
    line-height: 1.25;
  `,

  h3: css`
    font-size: calc(${token.fontSize}px * 1.5);
    font-weight: bold;
    line-height: 1.25;
  `,

  h4: css`
    font-size: calc(${token.fontSize}px * 1.25);
    font-weight: bold;
    line-height: 1.25;
  `,

  h5: css`
    font-size: ${token.fontSize}px;
    font-weight: bold;
    line-height: 1.25;
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

  p: css`
    margin-block: 0;
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
  `,
  underline: css`
    text-decoration: underline;
  `,
  warning: css`
    color: ${token.colorWarning};
  `,
}));
