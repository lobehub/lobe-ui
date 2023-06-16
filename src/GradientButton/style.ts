import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token, isDarkMode, stylish }) => {
  return {
    bg: css`
      position: absolute;
      z-index: -1;
      top: 0;
      left: 0;

      width: 100%;
      height: 100%;

      background: ${token.colorBgLayout};
      border-radius: inherit;
    `,
    button: css`
      position: relative;
      z-index: 1;
      background: ${token.colorBgLayout};
      border: none;

      &::before {
        ${stylish.gradientAnimation}
        content: '';

        position: absolute;
        z-index: 0;
        inset: 0;

        overflow: hidden;

        padding: 1px;

        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);

        mask-composite: xor;
      }

      > span {
        position: relative;
        z-index: 10;
      }

      &:hover {
        &::before {
          mask: unset;
        }
      }
    `,
    glow: css`
      ${stylish.gradientAnimation}
      position: absolute;
      z-index: -1;
      top: 0;
      left: 0;

      width: 100%;
      height: 100%;

      opacity: ${isDarkMode ? 0.5 : 0.3};
      filter: blur(${isDarkMode ? 1.5 : 1}em);
      border-radius: inherit;
    `,
  };
});
