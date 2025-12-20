import { createStyles } from 'antd-style';
import chroma from 'chroma-js';

export const useStyles = createStyles(({ css, token, prefixCls }) => ({
  picker: css`
    position: relative;

    em-emoji-picker {
      --rgb-accent: ${chroma(token.colorPrimary) .rgb() .join(',')};
      --shadow: none;
      --rgb-background: ${chroma(token.colorBgElevated) .rgb() .join(',')};
      --border-radius: 0;
    }
  `,
  popover: css`
    .${prefixCls}-popover-container {
      overflow: hidden;
      padding: 0;
    }
  `,
  root: css`
    position: relative;
    transition: background 150ms ${token.motionEaseOut};

    &:hover {
      background: ${token.colorFillSecondary};
    }
  `,
  tabs: css`
    border-block-end: 1px solid ${token.colorBorderSecondary};

    .ant-tabs-tab {
      display: flex;
      align-items: center;
      justify-content: center;

      width: 32px;
      height: 32px;
      padding: 0 !important;
    }
  `,
}));
