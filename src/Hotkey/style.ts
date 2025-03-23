import { createStyles } from 'antd-style';
import { rgba } from 'polished';

export const useStyles = createStyles(
  ({ css, token }, inverseTheme: boolean) => css`
    kbd {
      overflow: hidden;
      display: flex;
      flex: none;
      align-items: center;
      justify-content: center;

      min-width: 16px;
      height: 22px;
      padding-block: 0;
      padding-inline: 8px;

      font-family: ${token.fontFamily};
      font-size: 12px;
      line-height: 1.1;
      color: ${inverseTheme ? token.colorTextTertiary : token.colorTextSecondary};
      text-align: center;
      white-space: nowrap;

      background: ${inverseTheme ? rgba(token.colorTextTertiary, 0.15) : token.colorFillTertiary};
      border: none;
      border-radius: ${token.borderRadiusSM}px;
    }
  `,
);
