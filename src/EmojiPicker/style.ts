import { createStaticStyles } from 'antd-style';

const prefixCls = 'ant';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  picker: css`
    position: relative;

    em-emoji-picker {
      --rgb-accent: var(--emoji-picker-rgb-accent, 0, 0, 0);
      --shadow: none;
      --rgb-background: var(--emoji-picker-rgb-background, 255, 255, 255);
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
    transition: background 150ms ${cssVar.motionEaseOut};

    &:hover {
      background: ${cssVar.colorFillSecondary};
    }
  `,
  tabs: css`
    border-block-end: 1px solid ${cssVar.colorBorderSecondary};

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
