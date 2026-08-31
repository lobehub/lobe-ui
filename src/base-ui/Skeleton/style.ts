import { createStaticStyles, keyframes } from 'antd-style';

const sweep = keyframes`
  0% {
    translate: -100% 0;
  }

  100% {
    translate: 100% 0;
  }
`;

const fade = keyframes`
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: .5;
  }
`;

export const styles = createStaticStyles(({ css, cssVar }) => {
  return {
    base: css`
      user-select: none;

      position: relative;

      overflow: hidden;
      flex: none;

      border-radius: ${cssVar.borderRadius};

      background: ${cssVar.colorFillContent};

      @media (prefers-reduced-motion: reduce) {
        animation: none;

        &::after {
          display: none;
        }
      }
    `,

    fade: css`
      will-change: opacity;
      animation: ${fade} 1.6s ease-in-out infinite;
    `,

    sweep: css`
      &::after {
        pointer-events: none;
        will-change: transform;
        content: '';

        position: absolute;
        inset: 0;

        background: linear-gradient(
          90deg,
          transparent 0%,
          ${cssVar.colorFill} 50%,
          transparent 100%
        );

        animation: ${sweep} 1.4s ease infinite;
      }
    `,

    text: css`
      display: flex;
      flex-direction: column;
      width: 100%;
    `,
  };
});
