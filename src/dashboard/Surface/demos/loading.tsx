import { Surface } from '@lobehub/ui/dashboard';

export default () => (
  <div style={{ display: 'grid', gap: 16 }}>
    <Surface loading title="First load" />
    <Surface loading title="Refreshing">
      Existing content stays while a small spinner shows in the header.
    </Surface>
  </div>
);
