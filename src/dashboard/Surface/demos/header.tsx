import { Button } from '@lobehub/ui/base-ui';
import { Surface } from '@lobehub/ui/dashboard';

export default () => (
  <Surface
    description="Requests in the last 7 days"
    extra={<Button size="small">Export</Button>}
    href="#usage"
    title="Usage"
  >
    Body content is padded. A trailing table meets the card edges.
  </Surface>
);
