import { createStaticStyles } from 'antd-style';

import { fadeIn } from '@/styles/animations';

import {
  STREAM_ANIMATION_CLASS_NAME,
  STREAM_ANIMATION_REHYPE_FALLBACK,
} from './streamAnimation.constants';

export const styles = createStaticStyles(({ css }) => {
  return {
    animated: css`
      .${STREAM_ANIMATION_CLASS_NAME},
      .animate-fade-in {
        opacity: 0;
        animation-delay: var(--stream-char-delay, 0ms);
        animation-duration: var(
          --stream-char-duration,
          ${STREAM_ANIMATION_REHYPE_FALLBACK.charDurationMs}ms
        );
        animation-fill-mode: both;
        animation-name: ${fadeIn};
        animation-timing-function: linear;
      }

      /* 只对 .base 级别的 span 应用流式动画，不要穿透到内部 */
      .katex-display .katex-html span {
        mask: none !important;
        animation: none !important;
      }
    `,
  };
});
