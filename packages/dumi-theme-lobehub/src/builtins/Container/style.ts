import { createStyles, FullToken } from 'antd-style';

export const useStyles = createStyles(({ token, prefixCls, css }) => {
  // 把首字母大写
  const toCamelCase = (str: string) => {
    return str.replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
  };

  const overwriteAlert = (type: string) => {
    const tokens = {
      background: token[`color${toCamelCase(type)}Bg` as unknown as keyof FullToken],
      text: token[`color${toCamelCase(type)}Text` as unknown as keyof FullToken],
    };

    return css`
      .${prefixCls}-alert-${type} {
        background: ${tokens.background};

        .${prefixCls}-alert-message {
          color: ${tokens.text};
          font-weight: bold;
        }

        .${prefixCls}-alert-description {
          .markdown {
            color: ${tokens.text};
          }
        }
      }
    `;
  };

  return {
    container: css`
      margin: 8px 0;

      ${overwriteAlert('info')}

      ${overwriteAlert('warning')}

      ${overwriteAlert('success')}

      ${overwriteAlert('error')}
    `,
    alert: css`
      border: none;

      .${prefixCls}-alert-message {
        font-weight: bold;
      }
    `,
    desc: css`
      p {
        margin: 0;
      }
    `,
  };
});
