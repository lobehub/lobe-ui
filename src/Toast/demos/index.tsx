import { ToastHost, toast } from '@lobehub/ui';
import { Button, Space } from 'antd';

export default () => {
  return (
    <>
      <ToastHost position="bottom-right" />
      <Space wrap>
        <Button onClick={() => toast.success('Operation successful!')}>Success</Button>
        <Button onClick={() => toast.error('Something went wrong!')}>Error</Button>
        <Button onClick={() => toast.info('Here is some information.')}>Info</Button>
        <Button onClick={() => toast.warning('This is a warning!')}>Warning</Button>
        <Button
          onClick={() =>
            toast.loading({
              description: 'Please wait...',
              title: 'Loading',
            })
          }
        >
          Loading
        </Button>
        <Button
          onClick={() =>
            toast({
              description: 'This is a custom toast with title and description.',
              title: 'Custom Toast',
            })
          }
        >
          Custom
        </Button>
        <Button onClick={() => toast.dismiss()}>Dismiss All</Button>
      </Space>
    </>
  );
};
