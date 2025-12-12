import { createStyles } from 'antd-style';

export const useStyles = createStyles(
  (
    { cx, token, css, prefixCls, stylish },
    {
      closable,
      hasTitle,
      showIcon,
    }: { closable?: boolean; hasTitle?: boolean; showIcon?: boolean },
  ) => {
    const baseBlockPadding = hasTitle ? 16 : 8;
    const baseInlinePadding = hasTitle ? 16 : 12;
    return {
      banner: css`
        border: none !important;
        border-radius: 0 !important;
      `,
      borderless: css`
        padding: 0 !important;
        border: none !important;
        background: transparent !important;
      `,
      borderlessExtraHeader: css`
        margin-block-start: ${baseBlockPadding}px;
        padding-inline: 0;
      `,
      colorfulText: css`
        .${prefixCls}-alert-message,.${prefixCls}-alert-description {
          color: inherit;
        }
      `,
      expandText: css`
        padding-inline-end: 12px;

        &:hover {
          cursor: pointer;
        }
      `,
      extra: css`
        position: relative;

        overflow: hidden;

        max-width: 100%;
        border: 1px solid;
        border-block-start: none;
        border-end-start-radius: ${token.borderRadiusLG}px;
        border-end-end-radius: ${token.borderRadiusLG}px;
      `,
      extraHeader: css`
        border-block-start: 1px dashed;
        border-radius: 0;
        background: transparent !important;
      `,
      filled: css``,
      glass: stylish.blur,
      hasExtra: css`
        border-block-end: none;
        border-end-start-radius: 0;
        border-end-end-radius: 0;
      `,
      outlined: css`
        background: transparent !important;
      `,
      root: cx(
        css`
          position: relative;

          display: flex;
          flex-direction: row;
          gap: ${hasTitle ? 12 : 8}px;
          align-items: flex-start;

          max-width: 100%;
          padding-block: ${baseBlockPadding}px;
          padding-inline: ${showIcon ? baseInlinePadding * 0.75 : baseInlinePadding}px
            ${closable ? baseInlinePadding * 0.75 : baseInlinePadding}px;

          .${prefixCls}-alert-message {
            font-weight: ${hasTitle ? 600 : 400};
            line-height: 24px;
            word-break: normal;
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
              word-break: normal;
              opacity: 0.75;
            }
          `,
      ),
    };
  },
);
