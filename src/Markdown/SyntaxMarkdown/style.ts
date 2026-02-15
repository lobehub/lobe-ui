import { createStaticStyles } from 'antd-style';

import { maskLeftToRight } from '@/styles/animations';

export const styles = createStaticStyles(({ css }) => {
  return {
    animated: css`
      --lobe-markdown-stream-animation: ${maskLeftToRight} 0.5s ease-in-out forwards;

      .animate-mask-left-to-right,
      .katex-html > .base,
      span.line > span,
      code:not(:has(span.line)) {
        animation: var(--lobe-markdown-stream-animation);
      }

      /* 只对 .base 级别的 span 应用流式动画，不要穿透到内部 */
      .katex-display .katex-html span {
        mask: none !important;
        animation: none !important;
      }
    `,
  };
});
