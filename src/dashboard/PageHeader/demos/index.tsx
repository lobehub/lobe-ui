import { Button } from '@lobehub/ui/base-ui';
import { PageHeader } from '@lobehub/ui/dashboard';

export default () => {
  return (
    <PageHeader
      action={<Button type="primary">New resource</Button>}
      description="A title, a short description, and the page actions. No product name is built in."
      title="Resources"
    />
  );
};
