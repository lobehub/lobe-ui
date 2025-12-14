import { Button, Empty } from '@lobehub/ui';

export default () => (
  <Empty
    action={<Button type="primary">Create Item</Button>}
    description="Create your first item to get started"
    title="No Items"
  />
);
