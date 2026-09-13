import { createStaticStyles, keyframes } from 'antd-style';

const neuralMove = keyframes`
  from {
    offset-distance: 0%;
  }
  to {
    offset-distance: 100%;
  }
`;

export const styles = createStaticStyles(({ css, cssVar }) => ({
  glyph: css`
    display: inline-flex;
    color: ${cssVar.colorTextSecondary};
  `,
  neuralDim: css`
    opacity: 0.35;
    fill: currentcolor;
  `,
  neuralParticle: css`
    offset-path: path('M20 50 L50 25 L80 50 L50 75 Z');
    offset-rotate: 0deg;
    fill: currentcolor;
    animation: ${neuralMove} 2.4s linear infinite;

    @media (prefers-reduced-motion: reduce) {
      offset-distance: 0%;
      animation: none;
    }
  `,
  neuralPath: css`
    opacity: 0.3;
    fill: none;
    stroke: currentcolor;
    stroke-width: 0.5;
  `,
  overlay: css`
    position: absolute;
    inset: 0;

    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
    justify-content: center;

    color: ${cssVar.colorTextSecondary};

    background: color-mix(in srgb, ${cssVar.colorBgContainer} 70%, transparent);
  `,
  ring: css`
    rotate: -90deg;
  `,
  ringProgress: css`
    stroke: ${cssVar.colorPrimary};
  `,
  ringTrack: css`
    stroke: ${cssVar.colorFillTertiary};
  `,
  root: css`
    display: inline-flex;
    align-items: center;
  `,
  tip: css`
    font-size: ${cssVar.fontSizeSM};
    color: ${cssVar.colorTextSecondary};
  `,
  wrapper: css`
    position: relative;
  `,
}));
