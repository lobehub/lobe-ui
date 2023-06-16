import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, cx, token }, prefixCls) => {
  const selected = css`
    font-weight: bold;
    color: ${token.colorPrimaryText};
    background: ${token.colorPrimaryBg};

    &:hover {
      color: ${token.colorPrimaryTextHover};
      background: ${token.colorPrimaryBgHover};
    }
  `;

  return {
    active: cx(
      `${prefixCls}-item-active`,
      css`
        background: ${token.colorFillTertiary};
      `,
    ),
    arrow: css`
      color: ${token.colorTextTertiary};
    `,
    item: cx(
      `${prefixCls}-item`,

      css`
        all: unset;

        user-select: none;
        scroll-margin: 50px;

        display: flex;
        align-items: center;
        justify-content: space-between;

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
    kbd: css`
      display: flex;
      align-items: center;
      justify-content: center;

      width: 18px;
      height: 20px;

      font-family: ${token.fontFamily};
      font-size: 14px;
      color: ${token.colorTextQuaternary};

      border-radius: 2px;
    `,

    selected: cx(`${prefixCls}-item-selected`, selected),
  };
});
