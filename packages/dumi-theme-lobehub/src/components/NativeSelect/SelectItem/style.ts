import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, cx, token }, prefixCls) => ({
  active: cx(
    `${prefixCls}-item-active`,
    css`
      background: ${token.colorFillTertiary};
    `,
  ),
  item: cx(
    `${prefixCls}-item`,

    css`
      all: unset;

      user-select: none;
      scroll-margin: 50px;

      display: block;

      box-sizing: inherit;
      width: 100%;
      padding: 12px 10px;

      font-family: ${token.fontFamily};
      font-weight: normal;
      line-height: 1;
      color: ${token.colorText};

      background: transparent;
      border-radius: 5px;

      &:hover {
        background: ${token.colorFillTertiary};
      }
    `,
  ),
  selected: cx(
    `${prefixCls}-item-selected`,
    css`
      font-weight: bold;
      color: ${token.colorPrimaryText};
      background: ${token.colorPrimaryBg};

      &:hover {
        color: ${token.colorPrimaryTextHover};
        background: ${token.colorPrimaryBgHover};
      }
    `,
  ),
}));
