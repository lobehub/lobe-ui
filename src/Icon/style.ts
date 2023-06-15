import { createStyles, keyframes } from 'antd-style';

export const useStyles = createStyles(({ css }) => {
  const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
  `;
  return {
    spin: css`
      animation: ${spin} 1s linear infinite;
    `,
  };
});
