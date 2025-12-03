import { createStyles } from 'antd-style';

export const useStyles = createStyles(
  ({ token, css }, { size, color }: { color?: string; size: number }) => {
    const dotColor = color || token.colorPrimary;

    return {
      container: css`
        display: flex;
        flex-direction: row;
        gap: 6px;
        align-items: center;
        justify-content: center;

        padding: ${token.paddingXS}px;
      `,

      // Default variant (fade)
      defaultDot: css`
        width: ${size}px;
        height: ${size}px;
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
        width: ${size * 4}px;
        height: ${size * 4}px;
      `,

      orbitDot: css`
        position: absolute;
        inset-block-start: 50%;
        inset-inline-start: 50%;
        transform-origin: ${size * 2}px 0;

        width: ${size}px;
        height: ${size}px;
        margin-block-start: -${size / 2}px;
        margin-inline-start: -${size / 2}px;
        border-radius: 50%;

        background-color: ${dotColor};

        animation: orbit-animation 1.2s linear infinite;

        @keyframes orbit-animation {
          0% {
            transform: rotate(0deg) translateX(${size * 2}px);
          }

          100% {
            transform: rotate(360deg) translateX(${size * 2}px);
          }
        }
      `,

      // Orbit variant
      orbitWrapper: css`
        position: relative;

        display: flex;
        align-items: center;
        justify-content: center;

        width: ${size * 5}px;
        height: ${size * 5}px;
        padding: ${token.paddingXS}px;
      `,

      // Pulse variant
      pulseDot: css`
        width: ${size}px;
        height: ${size}px;
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
        width: ${size}px;
        height: ${size}px;
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
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;

        background-color: ${dotColor};

        animation: wave-animation 1.24s ease-in-out infinite;

        @keyframes wave-animation {
          0%,
          100% {
            transform: translateY(0);
          }

          25% {
            transform: translateY(-${size * 1.5}px);
          }

          50% {
            transform: translateY(0);
          }
        }
      `,
    };
  },
);
