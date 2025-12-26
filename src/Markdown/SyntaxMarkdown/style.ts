import { createStyles, keyframes } from 'antd-style';

const fadeIn = keyframes`
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  `;

export const useStyles = createStyles(({ css }) => {
  return {
    animated: css`
      .animate-fade-in,
      .katex-html span,
      span.line > span,
      code:not(:has(span.line)) {
        opacity: 1;
        animation: ${fadeIn} 1s ease-in-out;
      }
    `,
  };
});
