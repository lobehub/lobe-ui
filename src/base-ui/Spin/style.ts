import { createStaticStyles, keyframes } from 'antd-style';

const nodePulse = keyframes`
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
`;

const particleFlow = keyframes`
  0% {
    transform: translateX(0);
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateX(50px);
    opacity: 0.5;
  }
`;

const coreBreath = keyframes`
  0%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  50% {
    transform: scale(1);
    opacity: 1;
  }
`;

const ringSpin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const reducedMotion = `
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const styles = createStaticStyles(({ css, cssVar }) => ({
  glyph: css`
    display: inline-flex;
    color: ${cssVar.colorTextSecondary};
  `,
  network: css`
    position: relative;
    display: inline-block;
    color: ${cssVar.colorTextSecondary};
  `,
  networkBox: css`
    position: absolute;
    inset-block-start: 0;
    inset-inline-start: 0;
    transform-origin: 0 0;

    width: 100px;
    height: 100px;
  `,
  networkCore: css`
    position: absolute;
    inset-block-start: 47px;
    inset-inline-start: 47px;

    width: 6px;
    height: 6px;

    background: currentcolor;

    animation: ${coreBreath} 2s infinite;
    ${reducedMotion}
  `,
  networkLines: css`
    position: absolute;
    inset: 0;
    width: 100px;
    height: 100px;

    line {
      opacity: 0.3;
      stroke: currentcolor;
      stroke-width: 0.5;
    }
  `,
  networkNode: css`
    position: absolute;

    margin: calc(var(--spin-node-size) / -2);
    border-radius: 50%;
    width: var(--spin-node-size);
    height: var(--spin-node-size);

    background: currentcolor;

    animation: ${nodePulse} 2s infinite;
    ${reducedMotion}
  `,
  networkParticle: css`
    position: absolute;
    inset-block-start: 50px;
    inset-inline-start: 25px;

    margin: calc(var(--spin-particle-size) / -2);
    border-radius: 50%;
    width: var(--spin-particle-size);
    height: var(--spin-particle-size);

    background: currentcolor;

    animation: ${particleFlow} 2s infinite;
    ${reducedMotion}
  `,
  networkRing: css`
    position: absolute;
    inset: 10px;

    border: 1px dashed currentcolor;
    border-radius: 50%;

    opacity: 0.4;

    animation: ${ringSpin} 20s linear infinite;
    ${reducedMotion}
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
