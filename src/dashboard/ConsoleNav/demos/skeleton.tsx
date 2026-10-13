import { ConsoleNavSkeleton } from '@lobehub/ui/dashboard';

export default () => (
  <div style={{ blockSize: 480, display: 'flex', inlineSize: 260 }}>
    <ConsoleNavSkeleton groups={[3, 4, 2]} />
  </div>
);
