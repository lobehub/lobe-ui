import { css, cssVar, keyframes } from 'antd-style';

const tint = (color: string, alpha: number) =>
  `color-mix(in srgb, ${color} ${alpha}%, transparent)`;

const glow = (color: string, scale = 1) =>
  `0 0 0 ${3 * scale}px ${tint(color, 70)}, 0 0 ${5 * scale}px ${4 * scale}px ${tint(color, 35)}`;

const ringIn = (color: string) => keyframes`
  from {
    box-shadow: ${glow(color, 2.5)};
  }
`;

const ring = (color: string) => css`
  &:focus-visible {
    outline: none;
    box-shadow: ${glow(color)};
    animation: ${ringIn(color)} 560ms cubic-bezier(0.32, 0.72, 0, 1);

    @media (prefers-reduced-motion: reduce) {
      animation: none;
    }

    @media (forced-colors: active) {
      outline: 2px solid CanvasText;
      animation: none;
    }
  }
`;

export const focusRing = ring(cssVar.colorInfo);

export const focusRingColor = ring;
