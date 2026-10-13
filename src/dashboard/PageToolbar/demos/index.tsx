import { Button, Input } from '@lobehub/ui/base-ui';
import { PageToolbar } from '@lobehub/ui/dashboard';

export default () => (
  <PageToolbar
    actions={
      <>
        <Button>Export</Button>
        <Button type="primary">Create</Button>
      </>
    }
  >
    <Input placeholder="Search" style={{ width: 240 }} />
  </PageToolbar>
);
