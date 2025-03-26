import { memo } from 'react';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

import Controls from './Controls';
import MermaidContainer from './MermaidContainer';

const MermaidZoomableContainer = memo<{ children?: string }>(({ children }) => {
  return (
    <TransformWrapper>
      <Controls />
      <TransformComponent wrapperStyle={{ minHeight: 240, width: '100%' }}>
        <MermaidContainer>{children}</MermaidContainer>
      </TransformComponent>
    </TransformWrapper>
  );
});

export default MermaidZoomableContainer;
