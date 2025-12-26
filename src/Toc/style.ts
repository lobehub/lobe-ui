import { createStaticStyles, cx, responsive } from 'antd-style';

import { lobeStaticStylish } from '@/styles';

const prefixCls = 'ant';

export const styles = createStaticStyles(({ css, cssVar }) => {
  const fixHeight = 36;

  return {
    anchor: cx(
      lobeStaticStylish.blur,
      css`
        overflow: hidden auto;
        max-height: 60dvh !important;
      `,
    ),
    container: css`
      position: sticky;
      inset-block-start: calc(var(--toc-header-height, 64px) + 64px);

      overscroll-behavior: contain;
      grid-area: toc;

      width: var(--toc-width, 176px);
      margin-inline-end: 24px;
      border-radius: 3px;

      -webkit-overflow-scrolling: touch;

      ${responsive.sm} {
        position: relative;
        inset-inline-start: 0;
        width: 100%;
        margin-block-start: 0;
      }

      > h4 {
        margin-block: 0 8px;
        margin-inline: 0;

        font-size: 12px;
        line-height: 1;
        color: ${cssVar.colorTextDescription};
      }
    `,
    expand: cx(
      lobeStaticStylish.blur,
      css`
        width: 100%;
        border-block-end: 1px solid ${cssVar.colorSplit};
        border-radius: 0;

        background-color: color-mix(in srgb, ${cssVar.colorBgLayout} 50%, transparent);
        box-shadow: ${cssVar.boxShadowSecondary};

        .${prefixCls}-collapse-content {
          overflow: auto;
        }

        .${prefixCls}-collapse-header {
          z-index: 10;
          padding-block: 8px !important;
          padding-inline: 16px 8px !important;
        }
      `,
    ),
    mobileCtn: css`
      width: 100%;
      height: ${fixHeight}px;

      .${prefixCls}-collapse-expand-icon {
        color: ${cssVar.colorTextQuaternary};
      }
    `,
  };
});
