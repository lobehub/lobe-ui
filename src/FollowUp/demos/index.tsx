import { FollowUp } from '@lobehub/ui';
import { useState } from 'react';

export default () => {
  const [sent, setSent] = useState<string>();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <FollowUp
        items={['Compare with last quarter', 'Break down by region', 'Export as CSV']}
        title="Try next"
        onFollowUp={setSent}
      />
      {sent && <span style={{ fontSize: 12, opacity: 0.6 }}>Sent: {sent}</span>}
    </div>
  );
};
