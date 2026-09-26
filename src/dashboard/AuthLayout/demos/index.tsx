import { Button, Input } from '@lobehub/ui/base-ui';
import { AuthLayout } from '@lobehub/ui/dashboard';
import { Box } from 'lucide-react';

export default () => {
  return (
    <AuthLayout
      aside={<div />}
      description="Sign in to the workspace. The mark and the side panel are slots."
      style={{ blockSize: 640 }}
      title="Welcome back"
      brand={
        <a aria-label="Home" href="#home" style={{ color: 'inherit' }}>
          <Box size={22} />
        </a>
      }
    >
      <Input aria-label="Email" placeholder="Email" />
      <Input aria-label="Password" placeholder="Password" type="password" />
      <Button block type="primary">
        Continue
      </Button>
    </AuthLayout>
  );
};
