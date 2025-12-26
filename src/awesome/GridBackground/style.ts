import { createStaticStyles, keyframes } from 'antd-style';

const highlightAnimation = keyframes`
  0% {
    mask-position: 100% 0%;
  }
  16%,100% {
    mask-position: 100% 200%;
  }
`;

const highlightAnimationReverse = keyframes`
  0% {
    mask-position: 100% 200%;
  }
  16%,100% {
    mask-position: 100% 0%;
  }
`;

export const styles = createStaticStyles(({ css }) => {
  const width = 24;
  const height = 36;

  return {
    background: css`
      position: absolute;
      inset-block-start: ${60 - height / 2}%;
      inset-inline-start: ${50 - width / 2}%;
      transform: rotateX(60deg);

      width: ${width}%;
      height: ${height}%;
      border-radius: 50%;

      background: var(--grid-background-color-1, transparent);
      filter: blur(2em) saturate(400%);
      box-shadow:
        0 0 1em 2em var(--grid-background-color-1, transparent),
        0 0 3em 6em var(--grid-background-color-2, transparent),
        0 0 6em 10em var(--grid-background-color-3, transparent),
        0 0 8em 16em var(--grid-background-color-4, transparent);
    `,
    backgroundContainer: css`
      position: absolute;
      z-index: -1;
      inset: 0;

      width: 100%;
      height: 100%;

      perspective: 200px;
    `,
    container: css`
      position: relative;

      mask-image: linear-gradient(to bottom, transparent, #fff 30%, #fff 70%, transparent);
      mask-size: cover;
    `,
    highlight: css`
      --duration: 6s;
      --delay: 0s;

      position: absolute;
      z-index: 1;
      inset: 0;

      animation: ${highlightAnimation} var(--duration) cubic-bezier(0.62, 0.62, 0.28, 0.67) infinite;
      animation-delay: var(--delay);

      mask-image: linear-gradient(to bottom, transparent 40%, #fff 60%, transparent);
      mask-size: 100% 200%;
    `,
    highlightReverse: css`
      --duration: 6s;
      --delay: 0s;

      position: absolute;
      z-index: 1;
      inset: 0;

      animation: ${highlightAnimationReverse} var(--duration) cubic-bezier(0.62, 0.62, 0.28, 0.67)
        infinite;
      animation-delay: var(--delay);

      mask-image: linear-gradient(to bottom, transparent 40%, #fff 60%, transparent);
      mask-size: 100% 200%;
    `,
  };
});
