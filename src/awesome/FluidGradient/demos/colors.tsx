import { FluidGradient } from '@lobehub/ui/awesome';

export default () => (
  <div style={{ blockSize: 240, overflow: 'hidden', position: 'relative' }}>
    <FluidGradient colors={['#22d3ee', '#3b82f6', '#10b981']} intensity={0.7} speed={2} />
  </div>
);
