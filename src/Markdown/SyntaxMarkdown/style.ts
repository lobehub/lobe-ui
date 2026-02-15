import { createStaticStyles } from 'antd-style';

import { fadeIn } from '@/styles/animations';

export const styles = createStaticStyles(({ css }) => {
  return {
    animated: css`
      .animate-fade-in,
      .katex-html > .base,
      span.line > span,
      code:not(:has(span.line)) {
        opacity: 1;
        animation: ${fadeIn} 1s ease-in-out;
      }

      /* 只对 .base 级别的 span 应用流式动画，不要穿透到内部 */
      .katex-display .katex-html span {
        mask: none !important;
        animation: none !important;
      }
    `,
  };
});
