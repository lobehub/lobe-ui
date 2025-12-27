import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar }) => {
  const size = 'var(--loading-dots-size, 8px)';
  const dotColor = 'var(--loading-dots-color, var(--ant-color-primary))';

  return {
    container: css`
      display: flex;
      flex-direction: row;
      gap: 6px;
      align-items: center;
      justify-content: center;

      padding: ${cssVar.paddingXS};
    `,

    // Default variant (fade)
    defaultDot: css`
      width: ${size};
      height: ${size};
      border-radius: 50%;

      background-color: ${dotColor};

      animation: fade-animation 1.2s ease-in-out infinite;

      @keyframes fade-animation {
        0%,
        100% {
          opacity: 0.3;
        }

        50% {
          opacity: 1;
        }
      }
    `,

    orbitContainer: css`
      position: relative;
      width: calc(${size} * 4);
      height: calc(${size} * 4);
    `,

    orbitDot: css`
      position: absolute;
      inset-block-start: 50%;
      inset-inline-start: 50%;
      transform-origin: calc(${size} * 2) 0;

      width: ${size};
      height: ${size};
      margin-block-start: calc(${size} / -2);
      margin-inline-start: calc(${size} / -2);
      border-radius: 50%;

      background-color: ${dotColor};

      animation: orbit-animation 1.2s linear infinite;

      @keyframes orbit-animation {
        0% {
          transform: rotate(0deg) translateX(calc(${size} * 2));
        }

        100% {
          transform: rotate(360deg) translateX(calc(${size} * 2));
        }
      }
    `,

    // Orbit variant
    orbitWrapper: css`
      position: relative;

      display: flex;
      align-items: center;
      justify-content: center;

      width: calc(${size} * 5);
      height: calc(${size} * 5);
      padding: ${cssVar.paddingXS};
    `,

    // Pulse variant
    pulseDot: css`
      width: ${size};
      height: ${size};
      border-radius: 50%;

      background-color: ${dotColor};

      animation: pulse-animation 1.2s ease-in-out infinite;

      @keyframes pulse-animation {
        0%,
        100% {
          transform: scale(0.8);
          opacity: 0.3;
        }

        50% {
          transform: scale(1.3);
          opacity: 1;
        }
      }
    `,

    // Typing variant
    typingDot: css`
      width: ${size};
      height: ${size};
      border-radius: 50%;

      background-color: ${dotColor};

      animation: typing-animation 1.2s ease-in-out infinite;

      @keyframes typing-animation {
        0%,
        100% {
          transform: scale(0.6);
          opacity: 0.2;
        }

        25% {
          transform: scale(1);
          opacity: 1;
        }

        50%,
        75% {
          transform: scale(0.6);
          opacity: 0.2;
        }
      }
    `,

    // Wave variant
    waveDot: css`
      width: ${size};
      height: ${size};
      border-radius: 50%;

      background-color: ${dotColor};

      animation: wave-animation 1.24s ease-in-out infinite;

      @keyframes wave-animation {
        0%,
        100% {
          transform: translateY(0);
        }

        25% {
          transform: translateY(calc(${size} * -1.5));
        }

        50% {
          transform: translateY(0);
        }
      }
    `,
  };
});
