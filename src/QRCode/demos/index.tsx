import { Flexbox, QRCode  } from '@lobehub/ui';
import { useState } from 'react';

export default () => {
  const [expired, setExpired] = useState(true);

  return (
    <Flexbox horizontal gap={24} padding={16} wrap="wrap">
      <QRCode value="https://lobehub.com" />
      <QRCode
        icon={<img alt="" height="100%" src="https://lobehub.com/favicon.ico" width="100%" />}
        value="https://lobehub.com"
      />
      <QRCode status="loading" value="https://lobehub.com" />
      <QRCode
        status={expired ? 'expired' : 'active'}
        value="https://lobehub.com"
        onRefresh={() => setExpired(false)}
      />
    </Flexbox>
  );
};
