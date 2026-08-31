import { createStaticStyles, keyframes } from 'antd-style';

const sweep = keyframes`
  0% {
    translate: -100% 0;
  }

  100% {
    translate: 100% 0;
  }
`;

export const styles = createStaticStyles(({ css, cssVar }) => {
  return {
    animated: css`
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

      @media (prefers-reduced-motion: reduce) {
        &::after {
          display: none;
        }
      }
    `,

    base: css`
      user-select: none;

      position: relative;

      overflow: hidden;
      flex: none;

      border-radius: ${cssVar.borderRadius};

      background: ${cssVar.colorFillContent};
    `,

    text: css`
      display: flex;
      flex-direction: column;
      width: 100%;
    `,
  };
});
