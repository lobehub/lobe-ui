import { createStaticStyles } from 'antd-style';

import { fadeIn } from '@/styles/animations';

export const styles = createStaticStyles(({ css }) => {
  return {
    animated: css`
      .stream-char {
        opacity: 0;

        animation-name: ${fadeIn};
        animation-duration: 280ms;
        animation-timing-function: cubic-bezier(0.33, 0, 0.67, 1);
        animation-fill-mode: forwards;
      }

      .stream-char-revealed {
        opacity: 1;
        animation: none;
      }

      .katex-display .katex-html span {
        mask: none !important;
        animation: none !important;
      }
    `,
  };
});
