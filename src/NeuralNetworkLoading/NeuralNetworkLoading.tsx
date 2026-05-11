'use client';

import { createStaticStyles, keyframes } from 'antd-style';
import { type CSSProperties, memo } from 'react';

import type { NeuralNetworkLoadingProps } from './type';

const pulseAnim = keyframes`
  0%, 100% { opacity: 0.3; }
  50%      { opacity: 1; }
`;

const flowAnim = keyframes`
  0%   { transform: translateX(0);                     opacity: 0.5; }
  50%  {                                                opacity: 1; }
  100% { transform: translateX(var(--flow-distance));  opacity: 0.5; }
`;

const rotateAnim = keyframes`
  100% { transform: rotate(360deg); }
`;

const scaleAnim = keyframes`
  0%, 100% { transform: scale(0.8); opacity: 0.5; }
  50%      { transform: scale(1);   opacity: 1; }
`;

const styles = createStaticStyles(({ css, cssVar }) => ({
  center: css`
    fill: ${cssVar.colorTextSecondary};
    animation: ${scaleAnim} 2s infinite;
  `,
  connection: css`
    opacity: 0.3;
    stroke: ${cssVar.colorTextSecondary};
    stroke-width: 0.5;
  `,
  container: css`
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  node: css`
    fill: ${cssVar.colorTextSecondary};
    animation: ${pulseAnim} 2s infinite;
  `,
  particle: css`
    fill: ${cssVar.colorTextSecondary};
    animation: ${flowAnim} 2s infinite;
  `,
  ring: css`
    transform-origin: center;

    fill: none;
    stroke: ${cssVar.colorFill};
    stroke-dasharray: 0 8;
    stroke-width: 1;

    animation: ${rotateAnim} 20s infinite linear;
  `,
  svg: css`
    width: 100%;
    height: 100%;
  `,
}));

const LAYER_COUNT = 3;
const NODE_COUNT = 3;

const NeuralNetworkLoading = memo<NeuralNetworkLoadingProps>(({ size = 16, className, style }) => {
  const nodes = [];
  for (let layerIndex = 0; layerIndex < LAYER_COUNT; layerIndex++) {
    for (let nodeIndex = 0; nodeIndex < NODE_COUNT; nodeIndex++) {
      const x = 25 + layerIndex * 25;
      const y = 25 + nodeIndex * 25;
      const delay = (layerIndex * NODE_COUNT + nodeIndex) * 0.2;
      nodes.push(
        <circle
          className={styles.node}
          cx={x}
          cy={y}
          key={`node-${layerIndex}-${nodeIndex}`}
          r="3"
          style={{ animationDelay: `${delay}s` }}
        />,
      );
    }
  }

  const connections = [];
  for (let layerIndex = 0; layerIndex < LAYER_COUNT - 1; layerIndex++) {
    for (let nodeIndex = 0; nodeIndex < NODE_COUNT; nodeIndex++) {
      const x1 = 25 + layerIndex * 25;
      const y1 = 25 + nodeIndex * 25;
      for (let targetIndex = 0; targetIndex < NODE_COUNT; targetIndex++) {
        const x2 = 25 + (layerIndex + 1) * 25;
        const y2 = 25 + targetIndex * 25;
        connections.push(
          <line
            className={styles.connection}
            key={`connection-${layerIndex}-${nodeIndex}-${targetIndex}`}
            x1={x1}
            x2={x2}
            y1={y1}
            y2={y2}
          />,
        );
      }
    }
  }

  const particles = [0, 1, 2].map((index) => (
    <circle
      className={styles.particle}
      cx={25}
      cy={50}
      key={`particle-${index}`}
      r="1.5"
      style={
        {
          '--flow-distance': '50px',
          'animationDelay': `${index * 0.6}s`,
        } as CSSProperties
      }
    />
  ));

  return (
    <div
      className={[styles.container, className].filter(Boolean).join(' ')}
      style={{ height: size, width: size, ...style }}
    >
      <svg className={styles.svg} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        {connections}
        {nodes}
        {particles}
        <rect className={styles.center} height="6" width="6" x="47" y="47" />
        <circle className={styles.ring} cx="50" cy="50" r="40" />
      </svg>
    </div>
  );
});

NeuralNetworkLoading.displayName = 'NeuralNetworkLoading';

export default NeuralNetworkLoading;
