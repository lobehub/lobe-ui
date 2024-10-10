import { createStyles } from 'antd-style';
import chroma from 'chroma-js';

export const useStyles = createStyles(({ css, token, prefixCls }) => ({
  avatar: css`
    position: relative;
    border-radius: 50%;
    transition: box-shadow 100ms ${token.motionEaseOut};

    &:hover {
      box-shadow: 0 0 0 3px ${token.colorText};
    }
  `,
  editor: css`
    overflow: hidden;
    border: 1px solid ${token.colorBorder};
    border-radius: ${token.borderRadiusLG}px;
  `,
  loading: css`
    position: absolute;
    z-index: 1;
    inset: 0;

    background: ${token.colorBgMask};
    border-radius: 50%;
  `,
  picker: css`
    position: relative;

    em-emoji-picker {
      --rgb-accent: ${chroma(token.colorPrimary) .rgb() .join(',')};
      --shadow: none;
      --rgb-background: none;
      --border-radius: 0;
    }
  `,
  popover: css`
    .${prefixCls}-popover-inner {
      padding: 0;
    }
  `,
}));
