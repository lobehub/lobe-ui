import { createStaticStyles, cx, lobeStaticStylish } from '@/styles';

export const styles = createStaticStyles(({ css, cssVar }) => {
  return {
    container: css`
      position: relative;

      display: flex;
      flex-direction: column;
      gap: 8px;

      height: 100%;
      padding-block: 8px 12px;
      padding-inline: 0;
    `,
    fullscreen: css`
      position: absolute;
      z-index: 10;
      inset-block-end: 0;
      inset-inline: 0;

      background: ${cssVar.colorBgContainer};
    `,
    textarea: css`
      align-items: stretch;

      height: 100% !important;
      padding-block: 0;
      padding-inline: 8px;

      line-height: 1.5;
    `,
    textareaContainer: css`
      position: relative;
      flex: 1;
    `,
  };
});

export const actionBarStyles = createStaticStyles(({ css }) => ({
  left: cx(
    lobeStaticStylish.noScrollbar,
    css`
      overflow: auto hidden;
    `,
  ),
  right: css``,
  root: css`
    position: relative;
    overflow: hidden;
    width: 100%;
  `,
}));
