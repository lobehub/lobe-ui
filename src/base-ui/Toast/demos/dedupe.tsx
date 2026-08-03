import { Flexbox, toast } from '@lobehub/ui';
import { Button } from '@lobehub/ui/base-ui';
import { StoryBook, useCreateStore } from '@lobehub/ui/storybook';
import { useRef } from 'react';

export default () => {
  const store = useCreateStore();
  const attemptRef = useRef(0);

  const showNetworkError = () => {
    attemptRef.current += 1;
    toast.error({
      description: 'Check your firewall, proxy or VPN settings and try again.',
      id: 'network-error',
      title: `Connection refused (attempt ${attemptRef.current})`,
    });
  };

  return (
    <StoryBook levaStore={store}>
      <Flexbox horizontal gap={8} style={{ flexWrap: 'wrap' }}>
        <Button type="primary" onClick={showNetworkError}>
          Retry failing request
        </Button>
        <Button onClick={() => toast.info('Another notification')}>Show another toast</Button>
      </Flexbox>
    </StoryBook>
  );
};
