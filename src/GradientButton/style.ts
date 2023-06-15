import { createStyles, keyframes } from 'antd-style';

export const useStyles = createStyles(({ css, token, isDarkMode }) => {
  const gradient = keyframes`
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  `;

  return {
    button: css`
      position: relative;
      z-index: 1;
      background: ${token.colorBgLayout};
      border: none;

      &::before {
        content: '';

        position: absolute;
        z-index: 0;
        inset: 0;

        overflow: hidden;

        padding: 1px;

        background-image: linear-gradient(
          -45deg,
          ${token.gold},
          ${token.magenta},
          ${token.geekblue},
          ${token.cyan}
        );
        background-size: 400% 400%;
        border-radius: inherit;

        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);

        animation: 5s ${gradient} 5s ease infinite;

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
    glow: css`
      position: absolute;
      z-index: -1;
      top: 0;
      left: 0;

      width: 100%;
      height: 100%;

      opacity: ${isDarkMode ? 0.5 : 0.3};
      background-image: linear-gradient(
        -45deg,
        ${token.gold},
        ${token.magenta},
        ${token.geekblue},
        ${token.cyan}
      );
      background-size: 400% 400%;
      filter: blur(${isDarkMode ? 1.5 : 1}em);
      border-radius: inherit;

      animation: 5s ${gradient} 5s ease infinite;
    `,
  };
});
