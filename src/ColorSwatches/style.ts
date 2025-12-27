import { createStaticStyles } from 'antd-style';

const prefixCls = 'ant';

export const styles = createStaticStyles(({ css, cssVar }) => {
  return {
    active: css`
      box-shadow: inset 0 0 0 1px ${cssVar.colorFill};
    `,
    conic: css`
      background: conic-gradient(
        ${cssVar.red},
        ${cssVar.volcano},
        ${cssVar.orange},
        ${cssVar.gold},
        ${cssVar.yellow},
        ${cssVar.lime},
        ${cssVar.green},
        ${cssVar.cyan},
        ${cssVar.blue},
        ${cssVar.geekblue},
        ${cssVar.purple},
        ${cssVar.magenta},
        ${cssVar.red}
      );
      .${prefixCls}-color-picker-color-block {
        opacity: 0;
      }
    `,

    container: css`
      cursor: pointer;

      flex: none;

      width: var(--color-swatches-size, 24px);
      min-width: var(--color-swatches-size, 24px);
      height: var(--color-swatches-size, 24px);
      min-height: var(--color-swatches-size, 24px);

      background: ${cssVar.colorBgContainer};
      box-shadow: inset 0 0 0 1px ${cssVar.colorFillSecondary};

      &:hover {
        box-shadow:
          inset 0 0 0 1px rgba(0, 0, 0, 5%),
          0 0 0 2px ${cssVar.colorText};
      }
    `,

    picker: css`
      overflow: hidden;
      flex: none;

      width: var(--color-swatches-size, 24px);
      min-width: var(--color-swatches-size, 24px);
      height: var(--color-swatches-size, 24px);
      min-height: var(--color-swatches-size, 24px);
      padding: 0;
      border: none;

      box-shadow: inset 0 0 0 1px ${cssVar.colorFillSecondary};

      &:hover {
        box-shadow:
          inset 0 0 0 1px ${cssVar.colorFillSecondary},
          0 0 0 2px ${cssVar.colorText};
      }

      .${prefixCls}-color-picker-color-block {
        width: 100%;
        height: 100%;
        border: none;
        border-radius: inherit;
      }
    `,

    transparent: css`
      background-image: conic-gradient(
        ${cssVar.colorFillSecondary} 25%,
        transparent 25% 50%,
        ${cssVar.colorFillSecondary} 50% 75%,
        transparent 75% 100%
      );
      background-size: 50% 50%;
    `,
  };
});
