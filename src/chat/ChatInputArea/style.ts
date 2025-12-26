import { createStaticStyles, cx } from 'antd-style';

import { lobeStaticStylish } from '@/styles';

export const styles = createStaticStyles(({ css }) => {
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
    textarea: css`
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
