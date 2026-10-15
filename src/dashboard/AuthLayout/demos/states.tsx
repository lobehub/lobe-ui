import { Button, Flexbox } from '@lobehub/ui';
import { AuthLayout } from '@lobehub/ui/dashboard';

export default () => {
  return (
    <Flexbox gap={16}>
      <AuthLayout
        loading
        alert={<div role="alert">Your session expired. Sign in again.</div>}
        description="The form is a skeleton while the provider list loads."
        style={{ blockSize: 480, minBlockSize: 0 }}
        title="Sign in"
      />
      <AuthLayout background="grid" card={false} style={{ blockSize: 320, minBlockSize: 0 }}>
        <Flexbox align="center" gap={12}>
          <strong>Page not found</strong>
          <Button>Back home</Button>
        </Flexbox>
      </AuthLayout>
    </Flexbox>
  );
};
