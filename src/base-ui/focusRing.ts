import { css, cssVar, keyframes } from 'antd-style';

import { focusRingColor as ringColor } from '@/GlobalFocusRing/style';

const ringIn = keyframes`
  from {
    outline-color: transparent;
    outline-offset: 5px;
  }
`;

const ring = (color: string) => css`
  --lobe-focus-ring-color: ${color};

  &:focus-visible:not([data-lobe-focus-ring='managed']) {
    outline: 2px solid ${ringColor(color)};
    outline-offset: 2px;
    animation: ${ringIn} 200ms cubic-bezier(0.22, 1, 0.36, 1);

    @media (prefers-reduced-motion: reduce) {
      animation: none;
    }

    @media (forced-colors: active) {
      outline-color: CanvasText;
      animation: none;
    }
  }
`;

export const focusRing = ring(cssVar.colorInfo);

export const focusRingColor = ring;
