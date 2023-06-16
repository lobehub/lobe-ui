import { FullToken, createStyles } from 'antd-style';

const toCamelCase = (string_: string) => {
  return string_.replaceAll(/( |^)[a-z]/g, (L) => L.toUpperCase());
};
export const useStyles = createStyles(({ token, prefixCls, css }) => {
  // 把首字母大写

  const overwriteAlert = (type: string) => {
    const tokens = {
      background: token[`color${toCamelCase(type)}Bg` as unknown as keyof FullToken],
      text: token[`color${toCamelCase(type)}Text` as unknown as keyof FullToken],
    };

    return css`
      .${prefixCls}-alert-${type} {
        background: ${tokens.background};

        .${prefixCls}-alert-message {
          font-weight: bold;
          color: ${tokens.text};
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
    alert: css`
      border: none;

      .${prefixCls}-alert-message {
        font-weight: bold;
      }
    `,
    container: css`
      margin: 8px 0;

      ${overwriteAlert('info')}

      ${overwriteAlert('warning')}

      ${overwriteAlert('success')}

      ${overwriteAlert('error')}
    `,
    desc: css`
      p {
        margin: 0;
      }
    `,
  };
});
