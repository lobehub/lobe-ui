import { createStaticStyles } from 'antd-style';

import { maskLeftToRight } from '@/styles/animations';

export const styles = createStaticStyles(({ css }) => {
  return {
    animated: css`
      --lobe-markdown-stream-animation: ${maskLeftToRight} 0.5s ease-in-out forwards;

      .animate-mask-left-to-right,
      .katex-html span,
      span.line > span,
      code:not(:has(span.line)) {
        animation: var(--lobe-markdown-stream-animation);
      }
    `,
  };
});
