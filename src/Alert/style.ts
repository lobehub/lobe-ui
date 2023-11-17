import { createStyles } from 'antd-style';

export const useStyles = createStyles(
  (
    { cx, css, prefixCls },
    {
      closable,
      hasTitle,
      showIcon,
    }: { closable?: boolean; hasTitle?: boolean; showIcon?: boolean },
  ) => {
    const baseBlockPadding = hasTitle ? 16 : 8;
    const baseInlinePadding = hasTitle ? 16 : 12;
    return {
      colorfulText: css`
        .${prefixCls}-alert-message,.${prefixCls}-alert-description {
          color: inherit;
        }
      `,
      container: cx(
        css`
          display: flex;
          flex-direction: row;
          gap: ${hasTitle ? 12 : 8}px;
          align-items: flex-start;

          padding-right: ${closable ? baseInlinePadding : baseInlinePadding * 1.5}px;
          padding-left: ${showIcon ? baseInlinePadding : baseInlinePadding * 1.5}px;
          padding-block: ${baseBlockPadding}px;

          .${prefixCls}-alert-message {
            font-weight: ${hasTitle ? 600 : 400};
            line-height: 24px;
            word-break: break-all;
          }
          .${prefixCls}-alert-icon {
            display: flex;
            align-items: center;
            height: 24px;
            margin: 0;
          }
          .${prefixCls}-alert-close-icon {
            display: flex;
            align-items: center;
            height: 24px;
            margin: 0;
          }
        `,
        hasTitle &&
          css`
            .${prefixCls}-alert-description {
              line-height: 1.5;
              word-break: break-all;
              opacity: 0.75;
            }
          `,
      ),
      styleBlock: css`
        border: none;
      `,
      styleGhost: css`
        background: transparent;
      `,
      stylePure: css`
        padding: 0 !important;
        background: transparent;
        border: none;
      `,
    };
  },
);
