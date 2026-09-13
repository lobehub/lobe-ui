import { Flexbox, Result } from '@lobehub/ui';
import { Button } from '@lobehub/ui/base-ui';

export default () => {
  return (
    <Flexbox gap={16} padding={16}>
      <Result status="success" subTitle="Your changes have been saved." title="Success" />
      <Result
        extra={<Button>Retry</Button>}
        status="error"
        subTitle="Please try again later."
        title="Something went wrong"
      />
      <Result status="warning" subTitle="This action cannot be undone." title="Warning" />
      <Result status="info" subTitle="Your request is being processed." title="Processing" />
    </Flexbox>
  );
};
