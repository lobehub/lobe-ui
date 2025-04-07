import { createStyles, keyframes } from 'antd-style';

export const useStyles = createStyles(({ cx, isDarkMode, css, responsive }) => {
  const aurora = keyframes`
  0% {
    background-position: 50% 50%, 50% 50%;
  }
  100% {
    background-position: 350% 50%, 350% 50%;
  }
`;

  const dark = css`
    background-image:
      repeating-linear-gradient(
        100deg,
        rgb(0, 0, 0) 0%,
        rgb(0, 0, 0) 7%,
        rgba(0, 0, 0, 0%) 10%,
        rgba(0, 0, 0, 0%) 12%,
        rgb(0, 0, 0) 16%
      ),
      repeating-linear-gradient(
        100deg,
        rgb(59, 130, 246) 10%,
        rgb(165, 180, 252) 15%,
        rgb(147, 197, 253) 20%,
        rgb(221, 214, 254) 25%,
        rgb(96, 165, 250) 30%
      );
  `;

  const light = css`
    background-image:
      repeating-linear-gradient(
        100deg,
        rgb(255, 255, 255) 0%,
        rgb(255, 255, 255) 7%,
        rgba(0, 0, 0, 0%) 10%,
        rgba(0, 0, 0, 0%) 12%,
        rgb(255, 255, 255) 16%
      ),
      repeating-linear-gradient(
        100deg,
        rgb(59, 130, 246) 10%,
        rgb(165, 180, 252) 15%,
        rgb(147, 197, 253) 20%,
        rgb(221, 214, 254) 25%,
        rgb(96, 165, 250) 30%
      );
  `;

  const background = isDarkMode ? dark : light;

  return {
    bg: cx(
      background,
      css`
        pointer-events: none;
        will-change: transform;

        position: absolute;
        inset: -10px;

        max-height: 100vh;

        opacity: ${isDarkMode ? 0.3 : 0.6};
        background-position:
          50% 50%,
          50% 50%;
        background-size: 300%, 200%;
        filter: blur(10px) invert(${isDarkMode ? 0 : 1});

        animation: ${aurora} 100s linear infinite;

        mask-image: radial-gradient(at 100% 0, rgb(0, 0, 0) 10%, rgba(0, 0, 0, 0%) 70%);

        &::after {
          ${background};
          position: absolute;

          content: '';

          inset: 0;

          animation: ${aurora} 100s linear infinite;

          mix-blend-mode: difference;
          background-attachment: fixed;
          background-size: 200%, 100%;
        }

        ${responsive.mobile} {
          transform: scale(2);
          max-height: 25vh;
        }
      `,
    ),
    wrapper: css`
      position: absolute;
      z-index: 0;
      inset: 0;
      overflow: hidden;
    `,
  };
});
