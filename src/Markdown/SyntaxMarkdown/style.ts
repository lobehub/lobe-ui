import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css }) => {
  return {
    animated: css`
      .animate-stream,
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
