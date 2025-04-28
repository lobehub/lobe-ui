import { createStyles } from 'antd-style';
import chroma from 'chroma-js';

export const useStyles = createStyles(({ css, token, prefixCls }) => ({
  editor: css`
    overflow: hidden;
    border: 1px solid ${token.colorBorder};
    border-radius: ${token.borderRadiusLG}px;
  `,
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
    .${prefixCls}-popover-inner {
      overflow: hidden;
      padding: 0;
    }
  `,
  root: css`
    position: relative;
    transition: box-shadow 100ms ${token.motionEaseOut};

    &:hover {
      box-shadow: 0 0 0 3px ${token.colorText};
    }
  `,
}));
