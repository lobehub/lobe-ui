import { createStaticStyles, keyframes, responsive } from 'antd-style';

const aurora = keyframes`
  0% {
    background-position: 50% 50%, 50% 50%;
  }
  100% {
    background-position: 350% 50%, 350% 50%;
  }
`;

const darkBackground = `
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

const lightBackground = `
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

export const styles = createStaticStyles(({ css }) => ({
  bgDark: css`
    ${darkBackground}
    pointer-events: none;
    will-change: transform;

    position: absolute;
    inset: -10px;

    max-height: 100vh;

    opacity: 0.3;
    background-position:
      50% 50%,
      50% 50%;
    background-size: 300%, 200%;
    filter: blur(10px) invert(0);

    animation: ${aurora} 100s linear infinite;

    mask-image: radial-gradient(at 100% 0, rgb(0, 0, 0) 10%, rgba(0, 0, 0, 0%) 70%);

    &::after {
      ${darkBackground}
      position: absolute;

      content: '';

      inset: 0;

      animation: ${aurora} 100s linear infinite;

      mix-blend-mode: difference;
      background-attachment: fixed;
      background-size: 200%, 100%;
    }

    ${responsive.sm} {
      transform: scale(2);
      max-height: 25vh;
    }
  `,

  bgLight: css`
    ${lightBackground}
    pointer-events: none;
    will-change: transform;

    position: absolute;
    inset: -10px;

    max-height: 100vh;

    opacity: 0.6;
    background-position:
      50% 50%,
      50% 50%;
    background-size: 300%, 200%;
    filter: blur(10px) invert(1);

    animation: ${aurora} 100s linear infinite;

    mask-image: radial-gradient(at 100% 0, rgb(0, 0, 0) 10%, rgba(0, 0, 0, 0%) 70%);

    &::after {
      ${lightBackground}
      position: absolute;

      content: '';

      inset: 0;

      animation: ${aurora} 100s linear infinite;

      mix-blend-mode: difference;
      background-attachment: fixed;
      background-size: 200%, 100%;
    }

    ${responsive.sm} {
      transform: scale(2);
      max-height: 25vh;
    }
  `,

  wrapper: css`
    position: absolute;
    z-index: 0;
    inset: 0;
    overflow: hidden;
  `,
}));
