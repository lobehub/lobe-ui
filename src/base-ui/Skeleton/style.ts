import { createStaticStyles, keyframes } from 'antd-style';

const pulse = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
  100% {
    opacity: 1;
  }
`;

export const styles = createStaticStyles(({ css, cssVar }) => {
  return {
    animated: css`
      background: ${cssVar.colorFillSecondary};
      animation: ${pulse} 2s linear infinite;
    `,

    base: css`
      user-select: none;

      overflow: hidden;
      flex: none;

      border-radius: ${cssVar.borderRadius};

      background: ${cssVar.colorFillTertiary};
    `,

    text: css`
      display: flex;
      flex-direction: column;
      width: 100%;
    `,
  };
});
