import { createStyles } from 'antd-style';

export const useStyles = createStyles(
  (
    { cx, token, css, prefixCls },
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
        border: none;
        border-radius: 0;
      `,
      colorfulText: css`
        .${prefixCls}-alert-message,.${prefixCls}-alert-description {
          color: inherit;
        }
      `,
      container: cx(
        css`
          position: relative;

          display: flex;
          flex-direction: row;
          gap: ${hasTitle ? 12 : 8}px;
          align-items: flex-start;

          max-width: 100%;
          padding-block: ${baseBlockPadding}px;
          padding-inline: ${showIcon ? baseInlinePadding : baseInlinePadding * 1.5}px
            ${closable ? baseInlinePadding : baseInlinePadding * 1.5}px;

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
      expandText: css`
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
      extraBody: css`
        overflow-x: auto;
        width: 100%;
        padding-block: ${baseBlockPadding}px;
        padding-inline: ${baseInlinePadding}px;
      `,
      extraHeader: css`
        padding-block: ${baseBlockPadding * 0.75}px;
        padding-inline: ${baseInlinePadding * 0.75}px;
        border-block-start: 1px dashed;
      `,
      hasExtra: css`
        border-block-end: none;
        border-end-start-radius: 0;
        border-end-end-radius: 0;
      `,
      variantBlock: css`
        border: none;
      `,
      variantGhost: css`
        background: transparent !important;
      `,
      variantPure: css`
        padding: 0 !important;
        background: transparent !important;
        border: none;
      `,
      variantPureExtraHeader: css`
        margin-block-start: ${baseBlockPadding}px;
        margin-inline-start: ${-baseInlinePadding * 0.25}px;
        padding-inline: 0;
      `,
    };
  },
);
