import { Button,Flexbox, toast  } from '@lobehub/ui';
import { useRef } from 'react';

export default () => {
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
    <Flexbox horizontal gap={8} style={{ flexWrap: 'wrap' }}>
      <Button type="primary" onClick={showNetworkError}>
        Retry failing request
      </Button>
      <Button onClick={() => toast.info('Another notification')}>Show another toast</Button>
    </Flexbox>
  );
};
